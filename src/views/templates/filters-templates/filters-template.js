import {createFilterItemTemplate} from './filter-item-template';

export const createFiltersTemplate = (filters, currentFilterType) => {
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
