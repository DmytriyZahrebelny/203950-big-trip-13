import {createTripInfo} from "./view/trip-info";
import {createTravelCost} from './view/travel-cost';
import {createMenu} from './view/menu';
import {createFilters} from './view/filters';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
const headerTripMain = siteHeaderElement.querySelector(`.trip-main`);
const headerMenu = headerTripMain.querySelector(`.trip-controls`);

render(headerTripMain, createTripInfo(), `afterbegin`);

const headerTripInfo = headerTripMain.querySelector(`.trip-info`);

render(headerTripInfo, createTravelCost(), `beforeend`);
render(headerMenu, createMenu(), `afterbegin`);
render(headerMenu, createFilters(), `beforeend`);
