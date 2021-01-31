import AbstractView from './abstract.view';
import {createSortTemplate} from './templates/sort-templates';

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.dataset.sortType) {
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  }

  setSortTypeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`change`, this._sortTypeChangeHandler);
  }
}
