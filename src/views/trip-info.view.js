import AbstractView from './abstract.view';
import {createTripInfoTemplate} from './templates/trip-info-templates';

export default class TripInfo extends AbstractView {
  getTemplate() {
    return createTripInfoTemplate();
  }
}
