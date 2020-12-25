import {generatePoint} from './mocks/mocks';
import TripPresenter from './presenter/trip';

const POINT_COUNT = 5;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const siteBodyElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteBodyElement.querySelector(`.page-header`);
const siteMainElement = siteBodyElement.querySelector(`.page-main`);

const headerTrip = siteHeaderElement.querySelector(`.trip-main`);
const headerMenu = headerTrip.querySelector(`.trip-controls`);
const tripEvents = siteMainElement.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(headerTrip, headerMenu, tripEvents);

tripPresenter.init(points);

