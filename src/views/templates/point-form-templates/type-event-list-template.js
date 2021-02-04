export const createTypeEventListTemplate = (offers, type, isDisabled) => {
  return offers.map((offer) => (`
    <div class="event__type-item">
      <input
        id="event-type-${offer.type}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value=${offer.type}
        ${offer.type === type ? `checked` : ``}
        ${isDisabled ? `disabled` : ``}
      >
      <label
        class="event__type-label  event__type-label--${offer.type}"
        for="event-type-${offer.type}-1"
      >
        ${offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
      </label>
    </div>
  `)).join(``);
};
