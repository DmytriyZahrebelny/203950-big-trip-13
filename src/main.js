import {createTripInfo} from "./view/trip-info";
import {createTravelCost} from './view/travel-cost';
import {createMenu} from './view/menu';
import {createFilters} from './view/filters';
import {createSort} from './view/sort';
import {createTripEventsList} from './view/trip-events-list';
import {createCreationForm} from './view/creation-form';
import {createPoints} from './view/points';

import {generatePoint} from './mocks/mocks';

const POINT_COUNT = 5;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteBodyElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteBodyElement.querySelector(`.page-header`);
const siteMainElement = siteBodyElement.querySelector(`.page-main`);
const headerTripMain = siteHeaderElement.querySelector(`.trip-main`);
const headerMenu = headerTripMain.querySelector(`.trip-controls`);
const tripEvents = siteMainElement.querySelector(`.trip-events`);

render(headerTripMain, createTripInfo(), `afterbegin`);

const headerTripInfo = headerTripMain.querySelector(`.trip-info`);

render(headerTripInfo, createTravelCost(), `beforeend`);
render(headerMenu, createMenu(), `afterbegin`);
render(headerMenu, createFilters(), `beforeend`);
render(tripEvents, createSort(), `afterbegin`);
render(tripEvents, createTripEventsList(), `beforeend`);

const tripList = tripEvents.querySelector(`.trip-events__list`);
render(tripList, createCreationForm(), `afterbegin`);
render(tripList, createPoints(points), `beforeend`);
