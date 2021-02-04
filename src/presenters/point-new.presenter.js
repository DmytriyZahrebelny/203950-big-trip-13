import PointFormView from '../views/point-form.view';
import {remove, render, RenderPosition} from '../utils/render';
import {UserAction, UpdateType} from '../const';

export default class PointNew {
  constructor(pointListContainer, changeData, pointsModel) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._pointsModel = pointsModel;

    this._destroyCallback = null;
    this._pointFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._pointFormComponent !== null) {
      return;
    }

    const offers = this._pointsModel.getOffers() || [];
    const destinations = this._pointsModel.getDestinations() || [];

    this._pointFormComponent = new PointFormView(offers, destinations);
    this._pointFormComponent.setSubmitFormHandler(this._handleFormSubmit);
    this._pointFormComponent.setDeleteClickHandler(this._handleCancelClick);

    render(this._pointListContainer, this._pointFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointFormComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._pointFormComponent);
    this._pointFormComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._pointFormComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._pointFormComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
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
