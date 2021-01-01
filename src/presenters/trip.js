import TripInfoView from '../views/trip-info';
import TravelCostView from '../views/travel-cost';
import MenuView from '../views/menu';
import TripEventsListView from '../views/trip-events-list';
import SortView from '../views/sort';
import PointPresenter from './point';
import PointNewPresenter from './point-new';
import {RenderPosition, render} from '../utils';
import {SortType, UpdateType, UserAction, FilterType} from '../const';
import {filter} from '../utils/filter';

export default class Trip {
  constructor(
      headerTripContainer,
      headerMenuContainer,
      tripEventsContainer,
      pointsModel,
      filterModel
  ) {
    this._headerTripContainer = headerTripContainer;
    this._headerMenuContainer = headerMenuContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._tripInfoComponent = new TripInfoView();
    this._travelCostComponent = new TravelCostView();
    this._menuComponent = new MenuView();
    this._tripEventsComponent = new TripEventsListView();
    this._sortComponent = new SortView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._tripEventsComponent, this._handleViewAction);
  }

  init() {
    this._renderTrip();
  }

  createTask() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return [...filtredPoints].sort((a, b) => a.price - b.price);
    }

    return filtredPoints;
  }

  _renderTrip() {
    this._renderTripInfo();
    this._renderTravelCost();
    this._renderMenu();
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

  _renderMenu() {
    render(this._headerMenuContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripEventsList() {
    render(this._tripEventsContainer, this._tripEventsComponent, RenderPosition.BEFOREEND);
  }

  _renderPoints() {
    this._getPoints().forEach((point) => this._renderPoint(point));
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(
        this._tripEventsComponent,
        this._handleViewAction,
        this._handleModeChange
    );
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _rendersSort() {
    this._sortComponent.setSortTypeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPoints();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
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
        this._clearPointsList();
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

  _clearPointsList() {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};
  }
}
