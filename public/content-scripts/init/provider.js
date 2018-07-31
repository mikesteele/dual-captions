class TranslationProvider {
  constructor() {
    this.__captions = {};
    this.translate = this.translate.bind(this);
  }

  requestLanguage(language) {
    const adapter = window.DC.config;
    const fetcher = window.DC.fetcher;
    const parser  = window.DC.parser;
    // TODO - ^ Can be moved out of here?

    return new Promise((resolve, reject) => {
      if (this.__captions.hasOwnProperty(language)) {
        resolve();
      } else {
        fetcher.fetchCaptions(language, adapter.videoId)
          .then(parser.parse)
          .then(captions => this.__loadCaptions(captions, language))
          .then(resolve)
          .catch(reject);
      }
    });
  }

  findNearestCaption(translations, currentTime) {
    const nearestCaption = translations.find(translation => {
      return currentTime < translation.endTime;
    });
    return nearestCaption;
  }

  __loadCaptions(captions, language) {
    this.__captions[language] = captions;
    return Promise.resolve();
  }

  translate(text, language, currentTime) {
    return new Promise((resolve, reject) => {
      const fallbackProvider = window.DC.googleTranslator;
      // TODO - Can move out of here?

      if (this.__captions.hasOwnProperty(language)) {
        const nearestCaption = this.findNearestCaption(this.__captions[language], currentTime);
        if (nearestCaption) {
          resolve(nearestCaption.text);
        } else {
          fallbackProvider
            .translate(text, language, currentTime)
            .then(resolve)
            .catch(reject);
        }
      } else {
        fallbackProvider
          .translate(text, language, currentTime)
          .then(resolve)
          .catch(reject);
      }
    });
  }
}

window.TranslationProvider = TranslationProvider;
window.DC.provider = new TranslationProvider();
