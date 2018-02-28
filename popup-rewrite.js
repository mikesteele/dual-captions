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

function setObserverLanguage(language) {
  return new Promise((resolve, _) => {
    getActiveTabId()
      .then(tabId => {
        chrome.tabs.sendMessage(tabId, {
          type: 'change-language',
          info: {
            lang: language
          }
        }, resolve);
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
    chrome.tabs.executeScript(null, {code: `window.location.replace("https://github.com/mikesteele/dual-captions/")`}, () => {
      resolve();
    });
  });
}

function navigateToIssuesPage() {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {code: `window.location.replace("https://github.com/mikesteele/dual-captions/issues")`}, () => {
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
    resolve();
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
    .then(setListeners);
});
