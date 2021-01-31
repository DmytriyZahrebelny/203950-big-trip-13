import AbstractView from './abstract.view';
import {createFiltersTemplate} from './templates/filters-templates';

export default class Filters extends AbstractView {
  constructor(filters, typeFilter) {
    super();
    this._filters = filters;
    this._typeFilter = typeFilter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._typeFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
