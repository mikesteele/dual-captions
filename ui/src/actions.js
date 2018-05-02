import { getActiveTabId } from './utils/chrome.js';

// TODO - Combine? changeDCOn(isOn)?
export function turnDCOff(){
  return function (dispatch) {
    return new Promise((resolve, _) => {
      getActiveTabId()
        .then(tabId => {
          window.chrome.tabs.sendMessage(tabId, {
            type: 'stop-observer'
          }, resolve);
        })
        .then(isDCOn)
        .then(isOn => {
          if (!isOn) {
            dispatch({
              type: 'CHANGE_DC_ON',
              payload: false
            });
          } else {
            // TODO - Dispatch 'error' action
            // Unable to turn on observer
          }
        })
        .catch(() => {
          resolve();
          // TODO - Dispatch 'error' action
          // Unable to get active tab ID
        });
    })
  }
}

export function turnDCOn(){
  return function (dispatch) {
    return new Promise((resolve, _) => {
      getActiveTabId()
        .then(tabId => {
          window.chrome.tabs.sendMessage(tabId, {
            type: 'start-observer'
          }, resolve);
        })
        .then(isDCOn)
        .then(isOn => {
          if (isOn) {
            dispatch({
              type: 'CHANGE_DC_ON',
              payload: true
            });
          } else {
            // TODO - Dispatch 'error' action
            // Unable to turn on observer
          }
        })
        .catch(() => {
          resolve();
          // TODO - Dispatch 'error' action
          // Unable to get active tab ID
        });
    })
  }
}

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

