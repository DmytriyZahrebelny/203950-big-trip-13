export const createOffersListTemplate = (offers) => {
  const data = offers.length > 2 ? offers.slice(0, 2) : offers;

  const listOffers = data.map(({price, title}) => (`
    <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>
  `));

  return listOffers.join(``);
};
