/**
 *
 * Dual Captions
 * <3 Mike Steele 2018
 * License: MIT
 * 
 */

/**
 *
 * Chrome Utils
 *
 */

function getActiveTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, tabs => {
      if (tabs && tabs.length > 0) {
        resolve(tabs[0].id);
      } else {
        reject('Could not get active tab ID.');
      }
    });
  });
}

/**
 *
 * Page functions
 *
 */

function isObserverOn() {
  return new Promise((resolve, _) => {
    getActiveTabId()
      .then(tabId => {
        chrome.tabs.sendMessage(tabId, {
          type: 'is-on'
        }, resolve);
      })
      .catch(() => {});
  });
}

function getObserverLanguage(language) {
  return new Promise((resolve, _) => {
    getActiveTabId()
      .then(tabId => {
        chrome.tabs.sendMessage(tabId, {
          type: 'get-language',
        }, response => {
          resolve(response);
        });
      })
      .catch(() => {});
  });
}


function setObserverLanguage(language) {
  return new Promise((resolve, _) => {
    getActiveTabId()
      .then(tabId => {
        chrome.tabs.sendMessage(tabId, {
          type: 'change-language',
          info: {
            lang: language
          }
        }, response => {
          resolve(response);
        });
      })
      .catch(() => {});
  });
}

function startObserver() {
  return new Promise((resolve, _) => {
    getActiveTabId()
      .then(tabId => {
        chrome.tabs.sendMessage(tabId, {
          type: 'start-observer'
        }, resolve);
      })
      .catch(() => {});
  });
}

function stopObserver() {
  return new Promise((resolve, _) => {
    getActiveTabId()
      .then(tabId => {
        chrome.tabs.sendMessage(tabId, {
          type: 'stop-observer'
        }, resolve);
      })
      .catch(() => {});
  });
}

function navigateToGitHubPage() {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {code: `window.location.replace('https://github.com/mikesteele/dual-captions/')`}, () => {
      resolve();
    });
  });
}

function navigateToIssuesPage() {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {code: `window.location.replace('https://github.com/mikesteele/dual-captions/issues')`}, () => {
      resolve();
    });
  });
}

/**
 *
 * Browser Action functions
 *
 */

function showIcon(iconName) {
  chrome.browserAction.setIcon({path: `${iconName}.png`});
}

/**
 *
 * Popup functions
 *
 */

function initializeLanguageSelect() {
  return new Promise((resolve, _) => {
    const languageSelect = document.getElementById('language-select');
    for (lang in SUPPORTED_LANGUAGES) {
      let option = document.createElement('option');
      option.value = lang;
      option.label = SUPPORTED_LANGUAGES[lang];
      languageSelect.appendChild(option);
    }
    getObserverLanguage()
      .then(language => {
        languageSelect.value = language;
        resolve();
      });
  });
}

function showButton(button) {
  let onButton = document.getElementById('turn-on-button');
  let offButton = document.getElementById('turn-off-button');

  if (button === 'on-button') {
    offButton.classList.add('hidden');
    onButton.classList.remove('hidden');
  } else {
    onButton.classList.add('hidden');
    offButton.classList.remove('hidden');
  }
}

function showStatus(status) {
  let onStatus = document.getElementById('on-status');
  let offStatus = document.getElementById('off-status');

  if (status === 'on') {
    offStatus.classList.add('hidden');
    onStatus.classList.remove('hidden');
    //showIcon('icon-on');
  } else {
    onStatus.classList.add('hidden');
    offStatus.classList.remove('hidden');
    //showIcon('icon-off');
  }
}

function setStatus(isOn) {
  const errorContainer = document.getElementById('error-container');
  const setupContainer = document.getElementById('setup-container');
  const statusContainer = document.getElementById('status-container');
  const languageContainer = document.getElementById('language-container');
  const languageSelect = document.getElementById('language-select');

  if (typeof isOn !== 'undefined') {
    errorContainer.classList.add('hidden');
    setupContainer.classList.remove('hidden');
    statusContainer.classList.remove('hidden');
    languageContainer.classList.remove('hidden');
  } else {
    setupContainer.classList.add('hidden');
    statusContainer.classList.add('hidden');
    languageContainer.classList.add('hidden');
    errorContainer.classList.remove('hidden');
  }

  if (isOn === true) {
    showStatus('on');
    showButton('off-button');
    showIcon('icon-on');
  } else if (isOn === false) {
    showStatus('off');
    showButton('on-button');
    showIcon('icon-off');
  }

  getObserverLanguage()
    .then(language => {
      languageSelect.value = language;
    });
}

function setListeners() {
  return new Promise((resolve, _) => {
    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', e => {
      setObserverLanguage(languageSelect.options[languageSelect.selectedIndex].value)
        .then(() => {
          //
        });
    });
  
    const reportBugsLink = document.getElementById('report-bugs-link');
    reportBugsLink.addEventListener('click', e => {
      e.preventDefault();
      navigateToIssuesPage()
        .then(() => {
          window.close();
        });
    });

    const githubLink = document.getElementById('github-link');
    githubLink.addEventListener('click', e => {
      e.preventDefault();
      navigateToGitHubPage()
        .then(() => {
          window.close();
        });
    });

    const turnOffButton = document.getElementById('turn-off-button');
    turnOffButton.addEventListener('click', e => {
      e.preventDefault();
      stopObserver()
        .then(isObserverOn)
        .then(isOn => {
          setStatus(isOn);
        });
    });

    const turnOnButton = document.getElementById('turn-on-button');
    turnOnButton.addEventListener('click', e => {
      e.preventDefault();
      startObserver()
        .then(isObserverOn)
        .then(isOn => {
          setStatus(isOn);
        });
    });

    resolve();
  });
}

/**
 *
 * Start Dual Captions
 *
 */

document.addEventListener('DOMContentLoaded', () => {
  initializeLanguageSelect()
    .then(setListeners)
    .then(isObserverOn)
    .then(isOn => {
      setStatus(isOn);
    });
});
