import AbstractView from './abstract';

const createTravelCost = () => (`
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
  </p>
`);

export default class TravelCost extends AbstractView {
  getTemplate() {
    return createTravelCost();
  }
}
