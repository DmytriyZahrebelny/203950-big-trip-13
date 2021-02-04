export const createOffersListTemplate = (offers, type, isDisabled) => {
  const offersList = offers.find((offer) => offer.type === type);

  return offersList ? offersList.offers.map(({price, title}, i) => (`
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-seats-${i}"
        type="checkbox"
        name="event-offer-seats"
        ${isDisabled ? `disabled` : ``}
      >
      <label class="event__offer-label" for="event-offer-seats-${i}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
  `)).join(``) : ``;
};
