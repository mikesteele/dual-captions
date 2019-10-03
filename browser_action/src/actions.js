import { getActiveTabId, sendMessageToActiveTab, getSavedStore } from './utils/chrome.js';

export const checkLoadedLanguages = () => {
  return (dispatch) => {
    sendMessageToActiveTab({
      type: 'get-state'
    }).then(state => {
      if (state && state.hasOwnProperty('loadedLanguages')) {
        dispatch({
          type: 'CHANGE_LOADED_LANGUAGES',
          payload: state.loadedLanguages
        });
      }
    }).catch(err => {
      console.error(`Couldn\'t check loaded languages: ${err}`);
    })
  }
}

export const changeUILanguage = uiLanguage => dispatch => {
  sendMessageToActiveTab({
    type: 'change-ui-language',
    payload: uiLanguage
  }).then(() => {
    dispatch({
      type: 'CHANGE_UI_LANGUAGE',
      payload: uiLanguage
    });
  }).catch(() => {
    console.log('Cannot send message to active tab to change UI language.')
  });
}

/**

determineState()
-------------------
This action determines the popup's initial state.
It does so by checking the observer's state (dcState) and checking chrome.storage for a saved store.
It will prefer any settings in the observer, falling back to chrome.storage if the observer has default settings.
Some settings are only saved in chrome.storage, like UI language of the popup, and will be applied seperately if available.

**/

// TODO - Rename dcState => observerState?

export function determineState() {
  return function (dispatch) {
    return new Promise((resolve, _) => {
      // Get state of observer & a saved store in chrome.storage
      const dcStatePromise = sendMessageToActiveTab({
        type: 'get-state'
      });
      const savedStorePromise = getSavedStore();
      Promise.all([
        dcStatePromise,
        savedStorePromise
      ]).then(responses => {
        const [ dcState, savedStore ] = responses;
        console.log(`actions - determineState - dcState`);
        console.log(dcState);
        console.log(`actions - determineState - savedStore`);
        console.log(savedStore);

        // 1. Chrome.storage settings
        if (savedStore && savedStore.uiLanguage) {
          dispatch({
            type: 'CHANGE_UI_LANGUAGE',
            payload: savedStore.uiLanguage
          });
        }

        // 2. Observer-only settings
        if (dcState && dcState.hasOwnProperty('isOn')) {
          dispatch({
            type: 'CHANGE_DC_ON',
            payload: dcState.isOn
          });
        }

        // 3. All other settings
        if (dcState && dcState.hasOwnProperty('loadedLanguages')) {
          dispatch({
            type: 'CHANGE_LOADED_LANGUAGES',
            payload: dcState.loadedLanguages
          });
        }

        if (dcState && !dcState.settingsAreDefault) {
          dispatch({
            type: 'CHANGE_SECOND_LANGUAGE',
            payload: dcState.secondLanguage
          });
          dispatch({
            type: 'CHANGE_SETTINGS',
            payload: dcState.settings
          });
          resolve();
        } else if (savedStore) {
          dispatch({
            type: 'CHANGE_SETTINGS',
            payload: savedStore.settings
          });
          // Inject savedStore settings into observer
          dispatch(applyDCSettings()).then(resolve);
        } else {
          resolve();
        }
      });
    });
  }
}

/**

detectSite()
------------

This action asks the observer for the current site, and changes it in the store.
The observer gets the current site from the adapter, via adapter.site.

**/

export function detectSite() {
  return function (dispatch) {
    return new Promise((resolve, _) => {
      sendMessageToActiveTab({
        type: 'detect-site'
      }).then(response => {
        if (response.ok) {
          dispatch({
            type: 'CHANGE_DETECTED_SITE',
            payload: response.site
          });
        }
        resolve();
      }).catch(err => {
        console.log(`actions: Couldn't detect site.`);
        resolve();
      });
    });
  }
}

/**

popupOpened()
------------

This action sends a message to the observer that the popup was opened.
The observer relays this message to the adapter, via adapter.onPopupOpened(), which can respond with an error.
Error cases include detecting automatic captions on YouTube or image captions on Netflix, both of which aren't supported at this time.

**/

export function popupOpened() {
  return function (dispatch) {
    return new Promise((resolve, _) => {
      getActiveTabId()
        .then(tabId => {
          return new Promise(_resolve => {
            window.chrome.tabs.sendMessage(tabId, {
              type: 'popup-opened'
            }, _resolve);
          });
        })
        .then(response => {
          if (!response.ok && response.errorType) {
            dispatch({
              type: 'CHANGE_ERROR',
              payload: {
                hasError: true,
                errorType: response.errorType
              }
            });
          }
          resolve();
        })
        .catch(() => {
          console.log('actions: Can\'t get active tab ID, am I running locally?');
          resolve();
        });
    });
  }
}

export function changeDCLanguage(language) {
  return function (dispatch) {
    return new Promise((resolve, _) => {
      getActiveTabId()
        .then(tabId => {
          return new Promise(_resolve => {
            window.chrome.tabs.sendMessage(tabId, {
              type: 'change-language',
              payload: language
            }, _resolve);
          });
        })
        .then(() => {
          dispatch({
            type: 'CHANGE_SECOND_LANGUAGE',
            payload: language
          });
          resolve();
        })
        .catch(() => {
          console.log(`actions: Can't get active tab ID, am I running locally?`);
          // TODO - Dispatch 'error' action
          // Unable to get active tab ID
          resolve();
        });
    });
  }
}

// TODO - Combine? changeDCOn(isOn)?
export function turnDCOff(){
  return function (dispatch) {
    return new Promise((resolve, _) => {
      getActiveTabId()
        .then(tabId => {
          return new Promise(_resolve => {
            window.chrome.tabs.sendMessage(tabId, {
              type: 'stop-observer'
            }, _resolve);
          });
        })
        .then(response => {
          console.log('turnDCOff: response: ', response);
          if (!response) {
            dispatch({
              type: 'CHANGE_ERROR',
              payload: {
                hasError: true,
                errorType: 'no-dc'
              }
            });
            resolve();
          }
          if (response.ok) {
            dispatch({
              type: 'CHANGE_DC_ON',
              payload: false
            });
            resolve();
          } else {
            if (response.errorType) {
              dispatch({
                type: 'CHANGE_ERROR',
                payload: {
                  hasError: true,
                  errorType: response.errorType
                }
              });
            }
            resolve();
          }
        })
        .catch(() => {
          console.log(`actions: Can't get active tab ID, am I running locally?`);
          resolve();
          // TODO - Dispatch 'error' action
          // Unable to get active tab ID
        });
    });
  }
}

export function turnDCOn(){
  return function (dispatch) {
    return new Promise((resolve, _) => {
      getActiveTabId()
        .then(tabId => {
          return new Promise(_resolve => {
            window.chrome.tabs.sendMessage(tabId, {
              type: 'start-observer'
            }, _resolve);
          });
        })
        .then(response => {
          console.log('turnDCOn: response: ', response);
          if (!response) {
            dispatch({
              type: 'CHANGE_ERROR',
              payload: {
                hasError: true,
                errorType: 'no-dc'
              }
            });
            resolve();
          }
          if (response.ok) {
            dispatch({
              type: 'CHANGE_DC_ON',
              payload: true
            });
            resolve();
          } else {
            if (response.errorType) {
              dispatch({
                type: 'CHANGE_ERROR',
                payload: {
                  hasError: true,
                  errorType: response.errorType
                }
              });
            }
            resolve();
          }
        })
        .catch(() => {
          console.log(`actions: Can't get active tab ID, am I running locally?`);
          resolve();
          // TODO - Dispatch 'error' action
          // Unable to get active tab ID
        });
    });
  }
}

export function applyDCSettings() {
  return function (dispatch, getState) {
    return new Promise((resolve, _) => {
      const { settings } = getState();
      getActiveTabId()
        .then(tabId => {
          return new Promise(_resolve => {
            window.chrome.tabs.sendMessage(tabId, {
              type: 'change-settings',
              payload: settings
            }, _resolve);
          });
        })
        .then(resolve)
        .catch(() => {
          console.log(`actions: Can't get active tab ID, am I running locally?`);
          // TODO - Dispatch 'error' action
          // Unable to get active tab ID
          resolve();
        });
    });
  }
}
