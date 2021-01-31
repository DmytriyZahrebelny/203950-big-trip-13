import AbstractView from './abstract.view';
import {createTripEventsListTemplate} from './templates/trip-events-list-templates';

export default class TripEventsList extends AbstractView {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
