import TripInfoView from "../view/trip-info";
import TravelCostView from '../view/travel-cost';
import MenuView from '../view/menu';
import FiltersView from '../view/filters';
import TripEventsListView from '../view/trip-events-list';
import SortView from '../view/sort';
import PointPresenter from './point';
import {RenderPosition, render, updateItem} from '../utils';
import {SortType} from '../const';

export default class Trip {
  constructor(headerTripContainer, headerMenuContainer, tripEventsContainer) {
    this._headerTripContainer = headerTripContainer;
    this._headerMenuContainer = headerMenuContainer;
    this._tripEventsContainer = tripEventsContainer;

    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._tripInfoComponent = new TripInfoView();
    this._travelCostComponent = new TravelCostView();
    this._menuComponent = new MenuView();
    this._filtersComponent = new FiltersView();
    this._tripEventsComponent = new TripEventsListView();
    this._sortComponent = new SortView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._pointsList = points;
    this._sourcedPoints = this._pointsList.slice();

    this._renderTrip();
  }

  _renderTrip() {
    this._renderTripInfo();
    this._renderTravelCost();
    this._renderMenu();
    this._rendersFilters();
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

  _rendersFilters() {
    render(this._headerMenuContainer, this._filtersComponent, RenderPosition.BEFOREEND);
  }

  _renderTripEventsList() {
    render(this._tripEventsContainer, this._tripEventsComponent, RenderPosition.BEFOREEND);
  }

  _renderPoints() {
    this._pointsList.forEach((point) => this._renderPoint(point));
  }

  _rendersSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPointsList();
    this._renderPoints();
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this._pointsList.sort((a, b) => a.price - b.price);
        break;
      default:
        this._pointsList = this._sourcedPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripEventsComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _handlePointChange(updatedPoint) {
    this._pointsList = updateItem(this._pointsList, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _clearPointsList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};
  }
}
