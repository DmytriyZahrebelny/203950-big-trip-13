import AbstractView from './abstract';

const createTripEventsList = () => (`
  <ul class="trip-events__list"></ul>
`);

export default class TripEventsList extends AbstractView {
  getTemplate() {
    return createTripEventsList();
  }
}
