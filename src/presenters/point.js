import PointFormView from '../views/point-form';
import PointView from '../views/points';

import {RenderPosition, render, replace, remove} from '../utils';
import {UserAction, UpdateType} from '../const';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
  CREATING: `CREATING`
};

export default class Point {
  constructor(pointsListContainer, changeData, changeMode, pointsModel) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._pointsModel = pointsModel;

    this._pointComponent = null;
    this._pointForm = null;

    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._replacePointToEditForm = this._replacePointToEditForm.bind(this);
    this._toggleFavoritePoint = this._toggleFavoritePoint.bind(this);
    this._submitForm = this._submitForm.bind(this);
    this._closeForm = this._closeForm.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point) {
    this._point = point;
    const prevPointComponent = this._pointComponent;
    const prevPointForm = this._pointForm;
    const offers = this._pointsModel.getOffers();
    const destinations = this._pointsModel.getDestinations();

    this._pointComponent = new PointView(point);
    this._pointForm = new PointFormView(point, offers, destinations);

    this._pointComponent.setOpenPointFormClickHandler(this._replacePointToEditForm);
    this._pointComponent.toggleFavoritePointClickHandler(this._toggleFavoritePoint);
    this._pointForm.setSubmitFormHandler(this._submitForm);
    this._pointForm.setClosePointFormClickHandler(this._closeForm);
    this._pointForm.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevPointForm === null) {
      render(this._pointsListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._pointForm.getElement().contains(prevPointForm.getElement())) {
      replace(this._pointForm, prevPointForm);
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointForm, prevPointForm);
    }

    remove(prevPointComponent);
    remove(prevPointForm);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointForm);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditFormToPoint();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._pointForm.reset(this._point);
      this._replaceEditFormToPoint();
    }
  }

  _replaceEditFormToPoint() {
    replace(this._pointComponent, this._pointForm);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEditForm() {
    replace(this._pointForm, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _toggleFavoritePoint() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }

  _submitForm(data) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign({}, data)
    );
    this._replaceEditFormToPoint();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _closeForm() {
    this._replaceEditFormToPoint();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
}
