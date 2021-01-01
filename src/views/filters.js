import AbstractView from './abstract';

const createFilterItemTemplate = ({name, type, count}, currentFilterType) => {
  return (`
      <div class="trip-filters__filter">
        <input
          id="filter-${type}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value=${type}
          ${type === currentFilterType ? `checked` : ``}
          ${count ? `` : `disabled`}
        >
        <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
      </div>
  `);
};

const createFilters = (filters, currentFilterType) => {
  const filterItems = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join(``);

  return (`
    <form class="trip-filters" action="#" method="get">
      ${filterItems}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
`);
};

export default class Filters extends AbstractView {
  constructor(filters, typeFilter) {
    super();
    this._filters = filters;
    this._typeFilter = typeFilter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }
  getTemplate() {
    return createFilters(this._filters, this._typeFilter);
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
