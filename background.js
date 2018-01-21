// Tell pop-up to re-inject libraries if tab changes status/url 
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (changeInfo.url || changeInfo.status) {
    setValueInStorage('DUAL_CAPTIONS-librariesLoaded', false);
    // TODO: Use tabId to make tab-specific
  }
});

function setValueInStorage(key, value, callback) {
  let obj = {};
  obj[key] = value;
  chrome.storage.local.set(obj, function() {
  	if (callback) callback();
  });
}