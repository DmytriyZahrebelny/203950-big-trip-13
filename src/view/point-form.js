import SmartView from './smart';
import {pointEvents} from '../mocks/mocks';
import flatpickr from "flatpickr";
import dayjs from "dayjs";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const pointEventsKeys = Object.keys(pointEvents);

const createPointFormTypeEventTemplate = (type) => {
  return pointEventsKeys.map((key) => (`
    <div class="event__type-item">
      <input
        id="event-type-${key}-1"
        class="event__type-input
        visually-hidden"
        type="radio"
        name="event-type"
        value=${key}
        ${pointEvents[key] === type ? `checked` : ``}
      >
      <label class="event__type-label  event__type-label--${key}" for="event-type-${key}-1">${pointEvents[key]}</label>
    </div>
  `)).join(``);
};

const createPointFormDestinationEventTemplate = (type, destination) => (`
  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${destination} list="destination-list-1">
    <datalist id="destination-list-1">
      <option value="Amsterdam"></option>
      <option value="Geneva"></option>
      <option value="Chamonix"></option>
    </datalist>
  </div>
`);

const createPointForm = ({type, destination}) => (`
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
              ${createPointFormTypeEventTemplate(type)}
            </fieldset>
          </div>
        </div>
        ${createPointFormDestinationEventTemplate(type, destination)}
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
              <label class="event__offer-label" for="event-offer-luggage-1">
                <span class="event__offer-title">Add luggage</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">50</span>
              </label>
            </div>

            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
              <label class="event__offer-label" for="event-offer-comfort-1">
                <span class="event__offer-title">Switch to comfort</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">80</span>
              </label>
            </div>

            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
              <label class="event__offer-label" for="event-offer-meal-1">
                <span class="event__offer-title">Add meal</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">15</span>
              </label>
            </div>

            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
              <label class="event__offer-label" for="event-offer-seats-1">
                <span class="event__offer-title">Choose seats</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">5</span>
              </label>
            </div>

            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
              <label class="event__offer-label" for="event-offer-train-1">
                <span class="event__offer-title">Travel by train</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">40</span>
              </label>
            </div>
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
            ${destination === `London`
    ? `Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it's renowned for its skiing.`
    : `change`}
          </p>
        </section>
      </section>
    </form>
  </li>
`);

export default class PointForm extends SmartView {
  constructor(data) {
    super();

    this._data = data;
    this._datepickerFromFrom = null;
    this._datepickerFromTo = null;

    this._clickHandler = this._clickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._eventTypeHandler = this._eventTypeHandler.bind(this);
    this._dueDateChangeHandler = this._dueDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClosePointFormClickHandler(this._callback.click);
    this._setDatepicker();
  }

  getTemplate() {
    return createPointForm(this._data);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
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
    this.updateData({
      destination: evt.target.value
    });
  }

  _eventTypeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: pointEvents[evt.target.value]
    });
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
          dateFormat: `j F`,
          defaultDate: this._data.dueDate,
          onChange: this._dueDateChangeHandler
        }
    );

    this._datepickerTo = flatpickr(
        inputTimeTo,
        {
          dateFormat: `j F`,
          defaultDate: this._data.dueDate,
          onChange: this._dueDateChangeHandler
        }
    );
  }

  _dueDateChangeHandler([userDate]) {
    this.updateData({
      dueDate: dayjs(userDate).hour(23).minute(59).second(59).toDate()
    });
  }

  reset(data) {
    this.updateData(data);
  }
}
