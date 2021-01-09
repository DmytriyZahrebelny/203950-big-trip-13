import AbstractView from './abstract';


const createLoading = () => `<p class="trip-events__msg">Loading...</p>`;

export default class Loading extends AbstractView {
  getTemplate() {
    return createLoading();
  }
}
