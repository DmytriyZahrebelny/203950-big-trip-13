import AbstractView from './abstract.view';
import {createTravelCostTemplate} from './templates/travel-cost-templates';

export default class TravelCost extends AbstractView {
  getTemplate() {
    return createTravelCostTemplate();
  }
}
