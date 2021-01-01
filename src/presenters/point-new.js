import PointFormView from '../views/point-form';
import {remove, render, RenderPosition} from '../utils/render';
import {UserAction, UpdateType} from '../const';

export default class PointNew {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._pointFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._pointFormComponent !== null) {
      return;
    }

    this._pointFormComponent = new PointFormView();
    this._pointFormComponent.setSubmitFormHandler(this._handleFormSubmit);
    this._pointFormComponent.setDeleteClickHandler(this._handleCancelClick);

    render(this._pointListContainer, this._pointFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointFormComponent === null) {
      return;
    }

    remove(this._pointFormComponent);
    this._pointFormComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: Math.random() * (10000 - 0) + 0}, point)
    );
    this.destroy();
  }

  _handleCancelClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
