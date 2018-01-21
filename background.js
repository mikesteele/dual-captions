// Tell pop-up to re-inject libraries if tab changes status/url 
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status) {
    setValueInStorage(`DUAL_CAPTIONS-librariesLoaded-${tabId}`, false)
      .then(() => {});
  }
});

function setValueInStorage(key, value) {
  return new Promise((resolve, _) => {
    let obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, () => {
      resolve();
    });
  });
}
