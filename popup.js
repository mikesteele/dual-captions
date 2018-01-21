function loadLibraries() {
  chrome.tabs.executeScript(null, {file: "lib/google-translate-token.js"}, function() {
    chrome.tabs.executeScript(null, {file: "lib/querystring-encode.js"}, function() {
      chrome.tabs.executeScript(null, {file: "lib/google-translate-api.js"}, function() {
        chrome.tabs.executeScript(null, {file: "lib/dual-captions.js"}, function() {
          setValueInStorage('DUAL_CAPTIONS-librariesLoaded', true);
        });
      });
    });
  });
}

function getValueInStorage(key, callback) {
  chrome.storage.local.get(key, function(obj) {
    callback(obj[key]);
  });
}


function setValueInStorage(key, value, callback) {
  let obj = {};
  obj[key] = value;
  chrome.storage.local.set(obj, function() {
    if (callback) callback();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  getValueInStorage('DUAL_CAPTIONS-librariesLoaded', (librariesLoaded) => {
    if (!librariesLoaded) {
      loadLibraries();
    }
  });
});