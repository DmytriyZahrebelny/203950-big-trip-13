import PointFormView from '../view/point-form';
import PointView from '../view/points';

import {RenderPosition, render, replace, remove} from '../utils';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(pointsListContainer, changeData, changeMode) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editForm = null;

    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._replacePointToEditForm = this._replacePointToEditForm.bind(this);
    this._toggleFavoritePoint = this._toggleFavoritePoint.bind(this);
    this._submitForm = this._submitForm.bind(this);
    this._closeForm = this._closeForm.bind(this);
  }

  init(point) {
    this._point = point;
    const prevPointComponent = this._pointComponent;
    const prevEditForm = this._editForm;

    this._pointComponent = new PointView(point);
    this._editForm = new PointFormView(point);

    this._pointComponent.setOpenPointFormClickHandler(this._replacePointToEditForm);
    this._pointComponent.toggleFavoritePointClickHandler(this._toggleFavoritePoint);
    this._editForm.setSubmitFormHandler(this._submitForm);
    this._editForm.setClosePointFormClickHandler(this._closeForm);

    if (prevPointComponent === null || prevEditForm === null) {
      render(this._pointsListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._editForm.getElement().contains(prevEditForm.getElement())) {
      replace(this._editForm, prevEditForm);
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editForm, prevEditForm);
    }

    remove(prevPointComponent);
    remove(prevEditForm);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editForm);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditFormToPoint();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceEditFormToPoint();
    }
  }

  _replaceEditFormToPoint() {
    replace(this._pointComponent, this._editForm);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEditForm() {
    replace(this._editForm, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _toggleFavoritePoint() {
    this._changeData(
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }

  _submitForm() {
    this._replaceEditFormToPoint();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _closeForm() {
    this._replaceEditFormToPoint();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
}
