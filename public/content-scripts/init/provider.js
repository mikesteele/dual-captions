class TranslationProvider {
  constructor() {
    this.__captions = {};
    this.fallbackProvider = {
      translate: (text, language, currentTime) => {
        return window.DC.translate(text, {
          from: 'auto',
          to: language
        });
      }
    };
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
        fetcher.fetchCaptions(language, adapter.getVideoId())
          .then(parser.parse)
          .then(captions => this.__loadCaptions(captions, language))
          .then(resolve)
          .catch(reject);
      }
    });
  }

  findNearestCaption(translations, currentTime) {
    // TODO - FIXME - This is not strict enough.
    // TODO - Should let the caption fall through to the fallbackProvider if no caption available
    const nearestCaption = translations.find(translation => {
      return Math.abs(currentTime - translation.startTime) < 0.3;
    });
    return nearestCaption;
  }

  __loadCaptions(captions, language) {
    this.__captions[language] = captions;
    return Promise.resolve();
  }

  translate(text, language, currentTime) {
    return new Promise((resolve, reject) => {
      if (currentTime && this.__captions.hasOwnProperty(language)) {
        const nearestCaption = this.findNearestCaption(this.__captions[language], currentTime);
        if (nearestCaption) {
          // TODO - Add back? resolve(nearestCaption.text);
          resolve({
            text: `${nearestCaption.text} ✓`
          });
        } else {
          this.fallbackProvider
            .translate(text, language, currentTime)
            .then(resolve)
            .catch(reject);
        }
      } else {
        this.fallbackProvider
          .translate(text, language, currentTime)
          .then(resolve)
          .catch(reject);
      }
    });
  }
}

window.TranslationProvider = TranslationProvider;
window.DC.provider = new TranslationProvider();
