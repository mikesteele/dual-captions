export function getActiveTabId() {
  return new Promise((resolve, reject) => {
    if (window.chrome && window.chrome.tabs && window.chrome.tabs.query) {
      window.chrome.tabs.query({
        currentWindow: true,
        active: true
      }, tabs => {
        if (tabs && tabs.length > 0) {
          resolve(tabs[0].id);
        } else {
          reject('Could not get active tab ID.');
        }
      });
    } else {
      reject('window.chrome.tabs.query missing')
    }
  });
}

// TODO - Rewrite
export function sendMessageToActiveTab(message) {
  return new Promise((resolve, reject) => {
    getActiveTabId()
      .then(tabId => {
        return new Promise(_resolve => {
          window.chrome.tabs.sendMessage(tabId, message, _resolve);
        });
      })
      .then(resolve)
      .catch(err => {
        reject(err);
      });
    });
}

export function getSavedStore() {
  return new Promise((resolve, _) => {
    if (window.chrome && window.chrome.storage && window.chrome.storage.local) {
      window.chrome.storage.local.get('__DC_store__', result => {
        if (result.__DC_store__) {
          let savedStore;
          try {
            savedStore = JSON.parse(result.__DC_store__);
            resolve(savedStore);
          } catch(e) {
            console.log('utils - getSavedStore - Got bad JSON from chrome.storage');
            resolve();
          }
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}
