import SmartView from './smart';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

dayjs.extend(utc);

const createPointFormTypeEventListTemplate = (offers, type, isDisabled) => offers.map((offer) => (`
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

const createPointFormDestinationEventTemplate = (type, destination, destinationsList, isDisabled) => {
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

const createPointFormOffersListTemplate = (offers, type, isDisabled) => {
  const offersList = offers.find((offer) => offer.type === type);

  return offersList.offers.map(({price, title}, i) => (`
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
  `)).join(``);
};

const createPicturesListTemplate = (pictures) => {
  return pictures.map(({description, src}) => (`
    <img class="event__photo" src=${src} alt=${description}>
  `)).join(``);
};

const createPointForm = ({type = `flight`, destination, basePrice, isDisabled, isSaving, isDeleting}, offers, destinationsList, isEdit) => (`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createPointFormTypeEventListTemplate(offers, type, isDisabled)}
            </fieldset>
          </div>
        </div>
        ${createPointFormDestinationEventTemplate(type, destination, destinationsList, isDisabled)}
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice || ``}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">
          ${isSaving ? `saving...` : `save`}
        </button>
        <button class="event__reset-btn" type="reset">${isEdit ? `Delete` : `Cancel`}</button>
        <button class="event__rollup-btn" style=${!isEdit ? `display:none` : ``} type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createPointFormOffersListTemplate(offers, type, isDisabled)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
            ${destination ? destination.description : ``}
          </p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${destination ? createPicturesListTemplate(destination.pictures) : ``}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>
`);

export default class PointForm extends SmartView {
  constructor(data, offers = [], destinations = []) {
    super();

    this._data = PointForm.parsePointToData(data) || {};
    this._isEdit = data ? true : false;
    this._datepickerFromFrom = null;
    this._datepickerFromTo = null;
    this._offers = offers;
    this._destinations = destinations;

    this._clickHandler = this._clickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._eventDestinationInputHandler = this._eventDestinationInputHandler.bind(this);
    this._eventTypeInputHandler = this._eventTypeInputHandler.bind(this);
    this._eventPriceInputHandler = this._eventPriceInputHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  _setInnerHandlers() {
    const pointFormElement = this.getElement();
    pointFormElement
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._eventDestinationInputHandler);

    pointFormElement
      .querySelector(`.event__type-group`)
      .addEventListener(`change`, this._eventTypeInputHandler);

    pointFormElement
      .querySelector(`.event__input--price`)
      .addEventListener(`change`, this._eventPriceInputHandler);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClosePointFormClickHandler(this._callback.click);
    this._setDatepicker();
    this.setSubmitFormHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  getTemplate() {
    return createPointForm(this._data, this._offers, this._destinations, this._isEdit);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    this._callback.formSubmit(PointForm.parseDateToPoint(evt.target, this._data, this._offers));
  }

  setClosePointFormClickHandler(callback) {
    this._callback.click = callback;

    this.getElement()
      .querySelector(`.event__header`)
      .querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }

  setSubmitFormHandler(callback) {
    this._callback.formSubmit = callback;

    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _eventDestinationInputHandler(evt) {
    evt.preventDefault();
    const newDestination = this._destinations.find(({name}) => name === evt.target.value);

    this.updateData({
      destination: newDestination || {name: evt.target.value, description: ``, pictures: []}
    });
  }

  _eventTypeInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value
    });
  }

  _eventPriceInputHandler(evt) {
    evt.preventDefault();
    if (Number(evt.target.value)) {
      this.updateData({
        basePrice: Number(evt.target.value)
      });
    }
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  _setDatepicker() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    const [inputTimeFrom, inputTimeTo] = this.getElement().querySelectorAll(`.event__input--time`);
    this._datepickerFrom = flatpickr(
        inputTimeFrom,
        {
          dateFormat: `d/m/y H:i`,
          defaultDate: this._isEdit ? this._data.dateFrom : `today`,
          onChange: this._dateFromChangeHandler
        }
    );

    this._datepickerTo = flatpickr(
        inputTimeTo,
        {
          dateFormat: `d/m/y H:i`,
          defaultDate: this._isEdit ? this._data.dateTo : `today`,
          onChange: this._dateToChangeHandler
        }
    );
  }

  _dateFromChangeHandler([userDate]) {
    // if (dayjs(userDate).isAfter(this._)) {

    // }
    this.updateData({
      dateFrom: dayjs(userDate).utc().format()
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: dayjs(userDate).utc().format()
    });
  }

  static parsePointToData(task) {
    return Object.assign(
        {},
        task,
        {isDisabled: false, isSaving: false, isDeleting: false}
    );
  }

  static parseDateToPoint(form, data, offers) {
    const formData = Object.fromEntries(new FormData(form).entries());

    if (!data.type) {
      data.type = formData[`event-type`];
    }

    if (!data.isFavorite) {
      data.isFavorite = false;
    }

    if (!data.offers) {
      const offersData = offers.find(({type}) => type === formData[`event-type`]);
      data.offers = offersData.offers;
    }

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  reset(data) {
    this.updateData(data);
  }
}
