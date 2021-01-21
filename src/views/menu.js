import AbstractView from './abstract';
import {MenuItem} from '../const';

const createMenu = () => (`
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

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenu();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.id) {
      this._callback.menuClick(evt.target.id);
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item !== null) {
      item.checked = true;
    }
  }
}
