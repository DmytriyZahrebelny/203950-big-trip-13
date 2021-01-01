import {generatePoint} from './mocks/mocks';
import TripPresenter from './presenters/trip';
import FilterPresenter from './presenters/filter';
import PointsModel from './models/points';
import FilterModel from './models/filter';

const POINT_COUNT = 5;
const points = new Array(POINT_COUNT).fill().map((_, i) => generatePoint(i));

const pointsModel = new PointsModel();
pointsModel.setPoints(points);
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
    filterModel
);
const filterPresenter = new FilterPresenter(headerMenuElement, filterModel, pointsModel);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createTask();
});

filterPresenter.init();
tripPresenter.init();

