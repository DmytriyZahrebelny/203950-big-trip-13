import AbstractView from './abstract.view';
import {createLoadingTemplate} from './templates/loading-templates';

export default class Loading extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}
