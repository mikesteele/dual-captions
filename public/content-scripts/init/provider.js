class TranslationProvider {
  constructor() {
    this.translations = {};
  }

  requestLanguage(language) {
    const adapter = window.DC.config;
    const fetcher = window.DC.fetcher;
    const parser  = window.DC.parser;
    // TODO - ^ Can be moved out of here?

    return new Promise((resolve, reject) => {
      if (this.translations.hasOwnProperty(language)) {
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

  __loadCaptions(captions, language) {
    this.translations[language] = captions;
    return Promise.resolve();
  }
}

window.TranslationProvider = TranslationProvider;
window.DC.provider = new TranslationProvider();
