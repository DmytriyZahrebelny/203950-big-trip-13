import TripInfo from "./view/trip-info";
import TravelCost from './view/travel-cost';
import Menu from './view/menu';
import Filters from './view/filters';
import Sort from './view/sort';
import TripEventsList from './view/trip-events-list';
import CreationForm from './view/creation-form';
import Points from './view/points';
import {RenderPosition, render} from './utils';
import {generatePoint} from './mocks/mocks';

const POINT_COUNT = 5;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const siteBodyElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteBodyElement.querySelector(`.page-header`);
const siteMainElement = siteBodyElement.querySelector(`.page-main`);
const headerTripMain = siteHeaderElement.querySelector(`.trip-main`);
const headerMenu = headerTripMain.querySelector(`.trip-controls`);
const tripEvents = siteMainElement.querySelector(`.trip-events`);

const tripInfoComponent = new TripInfo();

render(headerTripMain, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

render(tripInfoComponent.getElement(), new TravelCost().getElement(), RenderPosition.BEFOREEND);
render(headerMenu, new Menu().getElement(), RenderPosition.AFTERBEGIN);
render(headerMenu, new Filters().getElement(), RenderPosition.BEFOREEND);
render(tripEvents, new Sort().getElement(), RenderPosition.AFTERBEGIN);

const tripListComponent = new TripEventsList();

render(tripEvents, tripListComponent.getElement(), RenderPosition.BEFOREEND);

points.forEach((data) => {
  const pointsComponent = new Points(data);
  const editForm = new CreationForm();

  const replaceEditFormToPoint = () => {
    tripListComponent.getElement().replaceChild(pointsComponent.getElement(), editForm.getElement());
  };

  const replacePointToEditForm = () => {
    tripListComponent.getElement().replaceChild(editForm.getElement(), pointsComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointsComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToEditForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editForm.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  editForm.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, () => {
    replaceEditFormToPoint();
  });

  render(tripListComponent.getElement(), pointsComponent.getElement(), RenderPosition.BEFOREEND);
});
