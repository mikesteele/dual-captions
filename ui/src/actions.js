import { getActiveTabId } from './utils/chrome.js';

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
          }
          if (response.ok) {
            dispatch({
              type: 'CHANGE_DC_ON',
              payload: false
            });
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
          }
          if (response.ok) {
            dispatch({
              type: 'CHANGE_DC_ON',
              payload: true
            });
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
        .catch(() => {
          console.log(`actions: Can't get active tab ID, am I running locally?`);
          // TODO - Dispatch 'error' action
          // Unable to get active tab ID
          resolve();
        });
    });
  }
}

export function updateStoreFromDC() {
  console.log(`actions: Dispatching updateStoreFromDC()`);
  return function (dispatch) {
    return new Promise((resolve, _) => {
      getActiveTabId()
        .then(tabId => {
          return new Promise(_resolve => {
            window.chrome.tabs.sendMessage(tabId, {
              type: 'get-state',
            }, _resolve);
          });
        })
        .then(dcState => {
          if (dcState) {
            // TODO - This would be better as one action... lol
            dispatch({
              type: 'CHANGE_DC_ON',
              payload: dcState.isOn
            });
            dispatch({
              type: 'CHANGE_SECOND_LANGUAGE',
              payload: dcState.secondLanguage
            });
            dispatch({
              type: 'CHANGE_SETTINGS',
              payload: dcState.settings
            });
          } else {
            dispatch({
              type: 'CHANGE_DC_ON',
              payload: false
            });
          }
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

// TODO - This isn't an action, move out of here.
export function isDCOn() {
  return new Promise((resolve, _) => {
    getActiveTabId()
      .then(tabId => {
        window.chrome.tabs.sendMessage(tabId, {
          type: 'is-on'
        }, resolve);
      })
      .catch(() => {
        resolve();
        // TODO - Need reject()?
      });
  });
}
