import {createTypeEventListTemplate} from './type-event-list-template';
import {createDestinationEventTemplate} from './destination-event-template';
import {createOffersListTemplate} from './offers-list-template';
import {createPicturesListTemplate} from './pictures-list-template';

export const createPointFormTemplate = ({type = `flight`, destination, basePrice, isDisabled, isSaving}, offers, destinationsList, isEdit) => (`
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
              ${createTypeEventListTemplate(offers, type, isDisabled)}
            </fieldset>
          </div>
        </div>
        ${createDestinationEventTemplate(type, destination, destinationsList, isDisabled)}
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
            ${createOffersListTemplate(offers, type, isDisabled)}
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
