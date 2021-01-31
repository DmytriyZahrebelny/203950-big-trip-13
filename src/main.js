import TripPresenter from './presenters/trip.presenter';
import FilterPresenter from './presenters/filter.presenter';
import PointsModel from './models/points.model';
import FilterModel from './models/filter.model';
import MenuView from './views/menu.view';
import StatisticsView from './views/statistics.view';
import Api from './api/api';
import {UpdateType, MenuItem, FilterType} from './const';
import {RenderPosition, render, remove} from './utils';

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const menuComponent = new MenuView();

const siteBodyElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteBodyElement.querySelector(`.page-header`);
const siteMainElement = siteBodyElement.querySelector(`.page-main`);
const siteBodyContainer = siteMainElement.querySelector(`.page-body__container`);

const headerTripElement = siteHeaderElement.querySelector(`.trip-main`);
const headerMenuElement = headerTripElement.querySelector(`.trip-controls`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(headerMenuElement, menuComponent, RenderPosition.AFTERBEGIN);

const tripPresenter = new TripPresenter(
    headerTripElement,
    headerMenuElement,
    tripEventsElement,
    pointsModel,
    filterModel,
    api
);
const filterPresenter = new FilterPresenter(headerMenuElement, filterModel, pointsModel);

let statisticsComponent = null;
const handlePointNewFormClose = () => {
  console.log(true);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      remove(statisticsComponent);
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      tripPresenter.createPoint(handlePointNewFormClose);
      break;
    case MenuItem.POINTS:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(
          pointsModel.getPoints(),
          pointsModel.getOffers()
      );
      render(siteBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint(handlePointNewFormClose);
});

filterPresenter.init();
tripPresenter.init();

api.getPoints()
  .then((data) => {
    pointsModel.setPoints(UpdateType.INIT, data);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

api.getOffers()
  .then((data) => {
    pointsModel.setOffers(UpdateType.INIT, data);
  })
  .catch(() => {
    pointsModel.setOffers(UpdateType.INIT, []);
  });

api.getDestinations()
  .then((data) => {
    pointsModel.setDestinations(UpdateType.INIT, data);
  })
  .catch(() => {
    pointsModel.setDestinations(UpdateType.INIT, []);
  });
