export const createDestinationEventTemplate = (type, destination, destinationsList, isDisabled) => {
  const citiesList = destinationsList.map(({name}) => name);

  return (`
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input
        class="event__input  event__input--destination"
        id="event-destination-1"
        type="text"
        name="event-destination"
        list="destination-list-1"
        value=${destination ? destination.name : ``}
        ${isDisabled ? `disabled` : ``}
      >
      <datalist id="destination-list-1">
        ${citiesList.map((city) => `<option value=${city}></option>`).join(``)}
      </datalist>
    </div>
  `);
};
