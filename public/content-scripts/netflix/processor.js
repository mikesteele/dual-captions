class NetflixTranslationProcessor {
  constructor() {
    this._onMessage = this._onMessage.bind(this);
    this._guessLanguage = this._guessLanguage.bind(this);
    chrome.runtime.onMessage.addListener(this._onMessage);
  }

  _onMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'process-netflix-caption-request':
      fetchUrl(message.payload)
        .then(window.DC.parser.parse)
        .then(this._guessLanguage)
        .then(captions, langauge => window.DC.provider.__loadCaptions(captions, language));
        .then(() => {
          // TODO - Send response?
        })
        .catch(err => {
          console.log(err);
          // TODO - sendResponse?
        })
      break;
    }
  }

  fetchUrl(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.text();
          } else {
            return Promise.reject('TODO - Credentials expired.')
          }
        })
        .then(responseText => {
          if (responseText && responseText.length) {
            resolve(responseText);
          } else {
            reject('TODO');
          }
        })
        .catch(err => {
          reject(`Couldn't fetch captions.`);
        });
    });
  }

  _guessLanguage(captions) {
    // TODO - Use window.DC.googleTranslator to detect language of 5 captions.
    // TODO - resolve({ captions, detectedLanguage })
  }
}
