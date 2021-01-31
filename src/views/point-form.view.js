import SmartView from './smart.view';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {createPointFormTemplate} from './templates/point-form-templates';
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

dayjs.extend(utc);

export default class PointForm extends SmartView {
  constructor(offers, destinations, data) {
    super();

    this._data = PointForm.parsePointToData(data);
    this._isEdit = data ? true : false;
    this._datepickerFromFrom = null;
    this._datepickerFromTo = null;
    this._offers = offers;
    this._destinations = destinations;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeFormClickHandler = this._closeFormClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._typePointChangeHandler = this._typePointChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  _setInnerHandlers() {
    const pointFormElement = this.getElement();
    pointFormElement
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);

    pointFormElement
      .querySelector(`.event__type-group`)
      .addEventListener(`change`, this._typePointChangeHandler);

    pointFormElement
      .querySelector(`.event__input--price`)
      .addEventListener(`change`, this._priceChangeHandler);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  restoreHandlers() {
    this.setClosePointFormClickHandler(this._callback.click);
    this.setSubmitFormHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setInnerHandlers();
    this._setDatepicker();
  }

  getTemplate() {
    return createPointFormTemplate(this._data, this._offers, this._destinations, this._isEdit);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    this._callback.formSubmit(PointForm.parseDateToPoint(evt.target, this._data, this._offers));
  }

  setSubmitFormHandler(callback) {
    this._callback.formSubmit = callback;

    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _closeFormClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClosePointFormClickHandler(callback) {
    this._callback.click = callback;

    this.getElement()
      .querySelector(`.event__header`)
      .querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeFormClickHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const newDestination = this._destinations.find(({name}) => name === evt.target.value);

    this.updateData({
      destination: newDestination || {name: evt.target.value, description: ``, pictures: []}
    });
  }

  _typePointChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    if (Number(evt.target.value)) {
      this.updateData({
        basePrice: Number(evt.target.value)
      });
    }
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
          defaultDate: this._data.dateFrom || `today`,
          onChange: this._dateFromChangeHandler,
          maxDate: this._data.dateTo || null
        }
    );

    this._datepickerTo = flatpickr(
        inputTimeTo,
        {
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.dateTo || `today`,
          onChange: this._dateToChangeHandler,
          minDate: this._data.dateFrom || `today`
        }
    );
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: dayjs(userDate).utc().format()
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: dayjs(userDate).utc().format()
    });
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
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
