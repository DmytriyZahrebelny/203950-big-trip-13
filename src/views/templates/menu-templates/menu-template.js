import {MenuItem} from '../../../const';

export const createMenuTemplate = () => (`
  <nav class="trip-controls__trip-tabs  trip-tabs">
    <a
      class="trip-tabs__btn  trip-tabs__btn--active"
      href="#"
      id=${MenuItem.POINTS}
    >
      Table
    </a>
    <a
      class="trip-tabs__btn"
      href="#"
      id=${MenuItem.STATISTICS}
    >
      Stats
    </a>
  </nav>
`);
