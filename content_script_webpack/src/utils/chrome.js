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
