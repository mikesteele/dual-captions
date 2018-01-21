function loadLibraries() {
  chrome.tabs.executeScript(null, {file: "lib/google-translate-token.js"}, function() {
    chrome.tabs.executeScript(null, {file: "lib/querystring-encode.js"}, function() {
      chrome.tabs.executeScript(null, {file: "lib/google-translate-api.js"}, function() {
        chrome.tabs.executeScript(null, {file: "lib/dual-captions.js"}, function() {
          setValueInStorage('DUAL_CAPTIONS-librariesLoaded', true, function() {

          });
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

var buttons = ['load-button', 'on-button', 'off-button'];
function showButton(buttonType) {
  buttons.forEach(buttonId => {
    if (buttonType === buttonId) {
      document.getElementById(buttonId).removeAttribute('hidden');
    } else {
      document.getElementById(buttonId).setAttribute('hidden', true);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getValueInStorage('DUAL_CAPTIONS-librariesLoaded', (librariesLoaded) => {
    if (!librariesLoaded) {
      showButton('load-button');
    } else {
      showButton('on-button');
    }
  });
  document.getElementById('load-button').addEventListener('click', () => {
    getValueInStorage('DUAL_CAPTIONS-librariesLoaded', (librariesLoaded) => {
      if (!librariesLoaded) {
        loadLibraries();
      }
      showButton('on-button');
    });
  });
  document.getElementById('on-button').addEventListener('click', () => {
    // TODO
    // 1. Stop observer
    showButton('off-button');
  });
  document.getElementById('off-button').addEventListener('click', () => {
    // TODO
    // 1. Restart observer
    showButton('on-button');
  });
});