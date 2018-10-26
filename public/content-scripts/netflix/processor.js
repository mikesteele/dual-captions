class NetflixTranslationProcessor {
  constructor() {
    this._onMessage = this._onMessage.bind(this);
    this._guessLanguageOfCaptions = this._guessLanguageOfCaptions.bind(this);
    this._guessLanguage = this._guessLanguage.bind(this);
    window.chrome.runtime.onMessage.addListener(this._onMessage);
  }

  _onMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'process-netflix-caption-request':
      console.log('processor - Processing Netflix caption request...');
      this.fetchUrl(message.payload)
        .then(window.DC.parser.parse)
        .then(this._guessLanguageOfCaptions)
        .then(result => {
          const {captions, language} = result;
          console.log(`processor - Loading captions for ${language}...`);
          return window.DC.provider.__loadCaptions(captions, language)
        })
        .then(() => {
          console.log('Loaded.');
          sendResponse({
            ok: true
          });
        })
        .catch(err => {
          console.log(err);
          sendResponse({
            ok: false,
            error: err
          });
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
            return Promise.reject(`Couldn't fetch captions, have credentials expired?`);
          }
        })
        .then(responseText => {
          if (responseText && responseText.length) {
            resolve(responseText);
          } else {
            reject(`Couldn't fetch captions, response to replay was empty.`);
          }
        })
        .catch(err => {
          reject(`Couldn't fetch captions.`);
        });
    });
  }

  // There's no information in the request URL or body about what language these captions are in.
  // So, for now, we have to guess.
  // We're using Google Translate "detect language" on the median caption.
  _guessLanguageOfCaptions(captions) {
    const renderElement = document.createElement('div');
    // Since Netflix captions are in HTML, we have to render them in this element to get their innerText.
    return new Promise((resolve, reject) => {
      renderElement.innerHTML = captions[0].text; // TODO - Make the median caption, guess for more captions
      this._guessLanguage(renderElement.innerText)
         .then(language => {
           resolve({
             captions: captions,
             language: language
           });
         })
         .catch(reject);
    });
  }

  _guessLanguage(text) {
    return new Promise((resolve, reject) => {
      window.DC.translate(text, {
        from: 'auto',
        to: 'en'
      })
      .then(response => {
        resolve(response.from.language.iso);
      })
      .catch(reject);
    });
  }
}

window.DC.processor = new NetflixTranslationProcessor();
