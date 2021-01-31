export const createFilterItemTemplate = ({name, type, count}, currentFilterType) => {
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
