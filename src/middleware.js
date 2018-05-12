import i18n from 'i18next';
import config from './config';

export const storageMiddleware = store => next => action => {
  let result = next(action);
  console.debug('Middleware: Writing store to chrome.storage.');
  if (window.chrome && window.chrome.storage) {
    let currentState = store.getState();
    delete currentState.hasError;
    window.chrome.storage.local.set({
      '__DC_store__': JSON.stringify(currentState)
    });
  }
  return result;
}

export const i18nMiddleware = store => next => action => {
  let result = next(action);
  if (action.type === 'CHANGE_UI_LANGUAGE' || action.type === 'HYDRATE_STORE') {
    const uiLanguage = store.getState().uiLanguage;
    i18n.changeLanguage(uiLanguage);
  }
  return result;
}

export const loggingMiddleware = store => next => action => {
  let result = next(action);
  console.log(`Middleware: ---`);
  console.log('Middleware: STORE: ', store.getState());
  console.log('Middleware: ACTION: ', action);
  console.log(`Middleware: ---`);
  return result;
}
