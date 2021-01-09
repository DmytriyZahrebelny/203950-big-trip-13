import AbstractView from './abstract';
import dayjs from 'dayjs';
import {TimeMS} from '../const';

const addZero = (value) => String(value).padStart(2, `0`);

const getDateDuration = (start, end) => {
  const different = dayjs(end).diff(start);
  const day = addZero(Math.ceil(different / TimeMS.day));
  const hours = addZero(Math.floor((different % TimeMS.day) / TimeMS.hour));
  const minutes = addZero(Math.round(((different % TimeMS.day) % TimeMS.hour) / TimeMS.minute));

  if (different >= TimeMS.day) {
    return `${day}D ${hours}H ${minutes}M`;
  }

  if (different >= TimeMS.hour) {
    return `${hours}H ${minutes}M`;
  }

  return `${hours}M`;
};

const createOffersList = (offers) => {
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

const createPoints = ({type, basePrice, isFavorite, destination, offers, dateTo, dateFrom}) => (
  `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">MAR 18</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${dateFrom}>${dayjs(dateFrom).format(`HH-mm`)}</time>
            &mdash;
            <time class="event__end-time" datetime=${dateTo}>${dayjs(dateTo).format(`HH-mm`)}</time>
          </p>
          <p class="event__duration">${getDateDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersList(offers)}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? `event__favorite-btn--active` : ``}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `
);

export default class Points extends AbstractView {
  constructor(points) {
    super();
    this.points = points;

    this._openEditFormClickHandler = this._openEditFormClickHandler.bind(this);
    this._favoritClickHandler = this._favoritClickHandler.bind(this);
  }

  getTemplate() {
    return createPoints(this.points);
  }

  _openEditFormClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _favoritClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  toggleFavoritePointClickHandler(callback) {
    this._callback.favoriteClick = callback;

    this.getElement()
      .querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoritClickHandler);
  }

  setOpenPointFormClickHandler(callback) {
    this._callback.click = callback;

    this.getElement()
      .querySelector(`.event__rollup-btn`).addEventListener(`click`, this._openEditFormClickHandler);
  }
}
