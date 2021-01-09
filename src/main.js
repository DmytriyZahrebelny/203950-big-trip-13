import TripPresenter from './presenters/trip';
import FilterPresenter from './presenters/filter';
import PointsModel from './models/points';
import FilterModel from './models/filter';
import Api from "./api/api.js";
import {UpdateType} from './const';

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const siteBodyElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteBodyElement.querySelector(`.page-header`);
const siteMainElement = siteBodyElement.querySelector(`.page-main`);

const headerTripElement = siteHeaderElement.querySelector(`.trip-main`);
const headerMenuElement = headerTripElement.querySelector(`.trip-controls`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(
    headerTripElement,
    headerMenuElement,
    tripEventsElement,
    pointsModel,
    filterModel,
    api
);
const filterPresenter = new FilterPresenter(headerMenuElement, filterModel, pointsModel);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createTask();
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
    pointsModel.setPoints(UpdateType.INIT, []);
  });

api.getDestinations()
  .then((data) => {
    pointsModel.setDestinations(UpdateType.INIT, data);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });
