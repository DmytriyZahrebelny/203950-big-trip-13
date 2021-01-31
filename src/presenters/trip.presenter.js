import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import TripInfoView from '../views/trip-info.view';
import TravelCostView from '../views/travel-cost.view';
import TripEventsListView from '../views/trip-events-list.view';
import SortView from '../views/sort.view';
import LoadingView from '../views/loading.view';
import EmptyListView from '../views/emptyList.view';
import PointPresenter, {State as PointPresenterViewState} from './point.presenter';
import PointNewPresenter from './point-new.presenter';
import {RenderPosition, render, remove} from '../utils';
import {SortType, UpdateType, UserAction} from '../const';
import {filter} from '../utils';

dayjs.extend(duration);

export default class Trip {
  constructor(
      headerTripContainer,
      headerMenuContainer,
      tripEventsContainer,
      pointsModel,
      filterModel,
      api
  ) {
    this._headerTripContainer = headerTripContainer;
    this._headerMenuContainer = headerMenuContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._tripInfoComponent = new TripInfoView();
    this._travelCostComponent = new TravelCostView();
    this._tripEventsComponent = new TripEventsListView();
    this._sortComponent = new SortView();
    this._loadingComponent = new LoadingView();
    this._emptyListComponent = new EmptyListView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(
        this._tripEventsComponent,
        this._handleViewAction,
        this._pointsModel
    );
  }

  init() {
    this._renderTrip();
  }

  destroy() {
    this._clearPointsList({resetSortType: true});

    remove(this._sortComponent);
    remove(this._tripEventsComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._currentSortType = SortType.DEFAULT;
    this._pointNewPresenter.init(callback);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return [...filtredPoints].sort((a, b) => b.basePrice - a.basePrice);
      case SortType.TIME:
        return [...filtredPoints].sort((a, b) => {
          const firstDateFrom = dayjs(a.dateFrom);
          const firstDateTo = dayjs(a.dateTo);
          const secondDateFrom = dayjs(b.dateFrom);
          const secondDateTo = dayjs(b.dateTo);

          const firstDifferent = dayjs.duration(firstDateTo.diff(firstDateFrom)).asMilliseconds();
          const secondDifferent = dayjs.duration(secondDateTo.diff(secondDateFrom)).asMilliseconds();

          return secondDifferent - firstDifferent;
        });
    }

    return filtredPoints;
  }

  _renderTrip() {
    this._renderTripInfo();
    this._renderTravelCost();
    this._rendersSort();
    this._renderTripEventsList();
    this._renderPoints();
  }

  _renderTripInfo() {
    render(this._headerTripContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTravelCost() {
    render(this._tripInfoComponent, this._travelCostComponent, RenderPosition.BEFOREEND);
  }

  _renderTripEventsList() {
    render(this._tripEventsContainer, this._tripEventsComponent, RenderPosition.BEFOREEND);
  }

  _renderEmptyList() {
    render(this._tripEventsContainer, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoints() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._pointsModel.getPoints().length === 0) {
      this._renderEmptyList();
      return;
    } else {
      remove(this._emptyListComponent);
    }

    this._getPoints().forEach((point) => this._renderPoint(point));
  }

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(
        this._tripEventsComponent,
        this._handleViewAction,
        this._handleModeChange,
        this._pointsModel
    );

    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPoints();
  }

  _rendersSort() {
    this._sortComponent.setSortTypeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
        .then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._pointNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearPointsList();
        this._renderPoints();
        break;
      case UpdateType.MAJOR:
        this._clearPointsList({resetSortType: true});
        this._renderPoints();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderPoints();
        break;
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _clearPointsList({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
