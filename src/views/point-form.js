import SmartView from './smart';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

dayjs.extend(utc);

const createPointFormTypeEventListTemplate = (offers, type) => offers.map((offer) => (`
  <div class="event__type-item">
    <input
      id="event-type-${offer.type}-1"
      class="event__type-input
      visually-hidden"
      type="radio"
      name="event-type"
      value=${offer.type}
      ${offer.type === type ? `checked` : ``}
    >
    <label
      class="event__type-label
      event__type-label--${offer.type}"
      for="event-type-${offer.type}-1"
    >
      ${offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
    </label>
  </div>
`)).join(``);

const createPointFormDestinationEventTemplate = (type, destination, destinationsList) => {
  const citiesList = destinationsList.map(({name}) => name);

  return (`
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input
        class="event__input
        event__input--destination"
        id="event-destination-1"
        type="text"
        name="event-destination"
        list="destination-list-1"
        value=${destination ? destination.name : ``}
      >
      <datalist id="destination-list-1">
        ${citiesList.map((city) => `<option value=${city}></option>`).join(``)}
      </datalist>
    </div>
  `);
};

const createPointFormOffersListTemplate = (offers, type) => {
  const offersList = offers.find((offer) => offer.type === type);

  return offersList.offers.map(({price, title}, i) => (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-${i}" type="checkbox" name="event-offer-seats">
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

const createPointForm = ({type = `flight`, destination, basePrice}, offers, destinationsList, isEdit) => (`
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
              ${createPointFormTypeEventListTemplate(offers, type)}
            </fieldset>
          </div>
        </div>
        ${createPointFormDestinationEventTemplate(type, destination, destinationsList)}
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice || ``}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isEdit ? `Delete` : `Cancel`}</button>
        <button class="event__rollup-btn" style=${!isEdit ? `display:none` : ``} type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createPointFormOffersListTemplate(offers, type)}
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

    this._data = data || {};
    this._isEdit = data ? true : false;
    this._datepickerFromFrom = null;
    this._datepickerFromTo = null;
    this._offers = offers;
    this._destinations = destinations;

    this._clickHandler = this._clickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._eventTypeHandler = this._eventTypeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
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

    this._callback.formSubmit(this._data);
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

  _destinationInputHandler(evt) {
    evt.preventDefault();
    const newDestination = this._destinations.find(({name}) => name === evt.target.value);
    this.updateData({
      destination: newDestination || {name: evt.target.value, description: ``, pictures: []}
    });
  }

  _eventTypeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value
    });
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationInputHandler);

    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`change`, this._eventTypeHandler);
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
          defaultDate: this._isEdit ? this._data.dataTo : `today`,
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
      dataTo: dayjs(userDate).utc().format()
    });
  }

  parseDataToPoint(data) {
    data = Object.assign({}, data);

    if (!data.type) {
      data.type = ``;
    }

    if (!data.isFavorite) {
      data.isFavorite = false;
    }

    if (!data.destination) {
      data.destination = false;
    }

    if (!data.price) {
      data.price = false;
    }
  }

  reset(data) {
    this.updateData(data);
  }
}
