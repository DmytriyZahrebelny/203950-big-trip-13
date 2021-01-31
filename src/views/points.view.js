import AbstractView from './abstract.view';
import {createPointsTemplate} from './templates/point-templates';

export default class Points extends AbstractView {
  constructor(points) {
    super();
    this.points = points;

    this._openEditFormClickHandler = this._openEditFormClickHandler.bind(this);
    this._favoritClickHandler = this._favoritClickHandler.bind(this);
  }

  getTemplate() {
    return createPointsTemplate(this.points);
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
