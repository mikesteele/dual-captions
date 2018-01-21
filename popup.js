let activeTabId;

function getActiveTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const activeTab = tabs[0];
      if (activeTab) {
          activeTabId = activeTab.id;
      } else {
          activeTabId = 9999;
          // activeTabId is only used to indentify tab state in chrome.storage.local,
          // Not used for chrome.tabs.excuteScript()
      }
      resolve();
    });
  });
}

function initalizeUI() {
  return new Promise((resolve, reject) => {
    Promise.all([
      getValueInStorage(`DUAL_CAPTIONS-librariesLoaded-${activeTabId}`),
      getValueInStorage(`DUAL_CAPTIONS-captionsOn-${activeTabId}`)
    ]).then(values => {
      const librariesLoaded = values[0];
      const captionsOn = values[1];
      if (!librariesLoaded) {
        showButton('load-button');
      } else {
        if (captionsOn) {
          showButton('off-button');
        } else {
          showButton('on-button');
        }
      }
      resolve();
    });
  });
}

const BUTTON_IDS = ['load-button', 'on-button', 'off-button'];
function showButton(button) {
  BUTTON_IDS.forEach(buttonId => {
    if (button === buttonId) {
      document.getElementById(buttonId).removeAttribute('hidden');
    } else {
      document.getElementById(buttonId).setAttribute('hidden', true);
    }
  });
}

function startObserver() {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {code: `window.startObserver()`}, () => {
      resolve();
    });
  });
}

function stopObserver() {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {code: `window.stopObserver()`}, () => {
      resolve();
    });
  });
}

function setListeners() {
  return new Promise((resolve, _) => {
    document.getElementById('load-button').addEventListener('click', () => {
      loadLibraries()
        .then(() => {
          showButton('on-button');
        });
    });
    document.getElementById('on-button').addEventListener('click', () => {
      stopObserver()
        .then(() => {
          showButton('off-button');
        });
    });
    document.getElementById('off-button').addEventListener('click', () => {
      startObserver()
        .then(() => {
          showButton('on-button');
        });
    });
    const fromLangaugeSelect = document.getElementById('from-select');
    fromLangaugeSelect.addEventListener('change', (e) => {
      setFromLanguage(fromLangaugeSelect.options[fromLangaugeSelect.selectedIndex].value)
        .then(() => {});
    });
    const toLangaugeSelect = document.getElementById('to-select');
    toLangaugeSelect.addEventListener('change', (e) => {
      setToLanguage(toLangaugeSelect.options[toLangaugeSelect.selectedIndex].value)
        .then(() => {});
    });
    resolve();
  });
}

function setFromLanguage(language) {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {code: `window.setFromLanguage('${language}')`}, () => {
      setValueInStorage(`DUAL_CAPTIONS-fromLanguage-${activeTabId}`, language)
        .then(() => {
          resolve();
        });
    });
  })
}

function setToLanguage(language) {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {code: `window.setToLanguage('${language}')`}, () => {
      setValueInStorage(`DUAL_CAPTIONS-toLanguage-${activeTabId}`, language)
        .then(() => {
          resolve();
        });
    });
  })
}

function loadLibraries() {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {file: "lib/google-translate-token.js"}, () => {
      chrome.tabs.executeScript(null, {file: "lib/querystring-encode.js"}, () => {
        chrome.tabs.executeScript(null, {file: "lib/google-translate-api.js"}, () => {
          chrome.tabs.executeScript(null, {file: "lib/dual-captions.js"}, () => {
            setValueInStorage(`DUAL_CAPTIONS-librariesLoaded-${activeTabId}`, true)
              .then(() => {
                resolve();
              });
          });
        });
      });
    });
  });
}

function getValueInStorage(key) {
  return new Promise((resolve, _) => {
    chrome.storage.local.get(key, function(obj) {
      resolve(obj[key]);
    });
  });
}

function setValueInStorage(key, value) {
  return new Promise((resolve, _) => {
    let obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, () => {
      resolve();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getActiveTabId()
    .then(initalizeUI)
    .then(setListeners)
    .catch(() => {}); // TODO
});

