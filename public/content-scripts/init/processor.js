class TranslationProcessor {
  constructor() {
    this._onMessage = this._onMessage.bind(this);
    this._guessLanguageOfCaptions = this._guessLanguageOfCaptions.bind(this);
    this._guessLanguage = this._guessLanguage.bind(this);
    window.chrome.runtime.onMessage.addListener(this._onMessage);
  }

  _onMessage(message, sender, sendResponse) {
    const adapter = window.DC.adapter;
    switch (message.type) {
      case 'process-caption-request':
      const videoId = adapter.getVideoId();
      if (!videoId) {
        return null;
      }
      console.log('processor - Processing caption request...');
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
      .catch(err => {
        console.error(`Couldn't guess language of captions: ${err}`)
      });
  }

  _guessLanguage(text) {
    const translationQueue = window.DC.translationQueue;
    return translationQueue.addToQueue(text);
  }
}

window.DC.processor = new TranslationProcessor();
