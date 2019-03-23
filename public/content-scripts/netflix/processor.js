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
          if (captions && language) {
            console.log(`processor - Loading captions for ${language}...`);
            return window.DC.provider.__loadCaptions(captions, language)
          } else {
            return Promise.reject(`Can't load captions, didn't get captions or language.`)
          }
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
  // So, for now, we're prompting the user for the language of the captions.
  _guessLanguageOfCaptions(captions) {
    return this._guessLanguage(captions[0].text)
      .then(language => ({
        captions: captions,
        language: language
      }))
      .catch(() => {}); // No-op
  }

  _guessLanguage(text) {
    return new Promise((resolve, reject) => {
      const result = window.prompt(`
        What language is this?

        ${text}
      `);
      if (result) {
        resolve(result)
      } else {
        reject('Could not guess language');
      }
    })
  }
}

window.DC.processor = new NetflixTranslationProcessor();
