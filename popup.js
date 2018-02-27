/**
 *
 * Dual Captions
 * 
 */

/**
 *
 * Page functions
 *
 */

function setObserverLanguage(language) {
  return new Promise((resolve, _) => {
    chrome.tabs.query({currentWindow: true,active: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'change-language',
        info: {
          lang: language
        }
      });
    });
  });
}

function getState() {
  return new Promise((resolve, _) => {
    Promise.all([
      getObserverLanguage()
      //
      // TODO - Eventually add here queries for options like extra space, two colors, etc. 
      //
    ]).then(values => {
      const language = values[0];
      if (language) {
        setLanguageSelect(language);
      }
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

function loadLibraries() {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {file: "lib/google-translate-token.js"}, () => {
      chrome.tabs.executeScript(null, {file: "lib/querystring-encode.js"}, () => {
        chrome.tabs.executeScript(null, {file: "lib/google-translate-api.js"}, () => {
          chrome.tabs.executeScript(null, {file: "lib/dual-captions.js"}, resolve);
        });
      });
    });
  });
}

function startObserver() {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {code: `window.DUAL_CAPTIONS.startObserver()`}, resolve);
  });
}

function stopObserver() {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {code: `window.DUAL_CAPTIONS.stopObserver()`}, resolve);
  });
}

function setExtraSpace(value) {
  return new Promise((resolve, _) => {
    chrome.tabs.executeScript(null, {code: `window.DUAL_CAPTIONS.setExtraSpace(${value})`}, resolve);
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

function showSteps(steps) {
  steps.forEach(step => {
    let shadow = document.querySelector(`.step-shadow[data-step='${step}']`);
    if (shadow) {
      shadow.classList.add('hidden');
    }
  });
}

function hideSteps(steps) {
  steps.forEach(step => {
    let shadow = document.querySelector(`.step-shadow[data-step='${step}']`);
    if (shadow) {
      shadow.classList.remove('hidden');
    }
  });
}

function showStatus(status) {
  let onStatus = document.getElementById('on-status');
  let offStatus = document.getElementById('off-status');
  let errorStatus = document.getElementById('error-status');

  if (status === 'on') {
    errorStatus.classList.add('hidden');
    offStatus.classList.add('hidden');
    onStatus.classList.remove('hidden');
    showIcon('icon-on');
  } else if (status === 'off') {
    errorStatus.classList.add('hidden');
    onStatus.classList.add('hidden');
    offStatus.classList.remove('hidden');
    showIcon('icon-off');
  } else {
    onStatus.classList.add('hidden');
    offStatus.classList.add('hidden');
    errorStatus.classList.remove('hidden');
    showIcon('icon-off');
  }
}

function showButton(button) {
  let turnOnButton = document.getElementById('turn-on-button');
  let turnOffButton = document.getElementById('turn-off-button');

  if (button === 'turn-on') {
    turnOffButton.classList.add('hidden');
    turnOnButton.classList.remove('hidden');
  } else {
    turnOnButton.classList.add('hidden');
    turnOffButton.classList.remove('hidden');
  }
}

function setLanguageSelect(language) {
  const languageSelect = document.getElementById('language-select');
  languageSelect.value = language;
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

    const turnOffButton = document.getElementById('turn-off-button');
    turnOffButton.addEventListener('click', e => {
      stopObserver()
        .then(isDualCaptionsOn)
        .then(isOn => {
          if (isOn) {
            showStatus('error');
          } else {
            showStatus('off');
            showButton('turn-on');
          }
        });
    });

    const turnOnButton = document.getElementById('turn-on-button');
    turnOnButton.addEventListener('click', e => {
      startObserver()
        .then(isDualCaptionsOn)
        .then(isOn => {
          if (isOn) {
            showStatus('on');
            showButton('turn-off');
          } else {
            showStatus('error');
          }
        });
    });


    const extraSpace = document.getElementById('extra-space');
    extraSpace.addEventListener('click', e => {
      setExtraSpace(extraSpace.checked)
        .then(() => {});
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
    .then(isLoaded => {
        showSteps(['step-1', 'step-2', 'step-3', 'step-4']);
    });
});
