class TranslationProvider {
  constructor() {
    // DC
    this.adapter = window.DC.config;
    this.fetcher = window.DC.fetcher;
    this.parser  = window.DC.parser;

    // Props
    this.__captions = {};
    this.fallbackProvider = {
      translate: (text, language, currentTime) => {
        return window.DC.translate(text, {
          from: 'auto',
          to: language
        });
      }
    };

    // Methods
    this.translate = this.translate.bind(this);
  }

  requestLanguage(language) {
    return new Promise((resolve, reject) => {
      if (this.__captions.hasOwnProperty(language)) {
        resolve();
      } else {
        this.fetcher.fetchCaptions(language, this.adapter.getVideoId())
          .then(this.parser.parse)
          .then(captions => this.__loadCaptions(captions, language))
          .then(resolve)
          .catch(reject);
      }
    });
  }

  findNearestCaption(translations, currentTime) {
    const nearestCaption = translations.find(translation => {
      return Math.abs(currentTime - translation.startTime) < 0.3;
    });
    return nearestCaption;
  }

  __loadCaptions(captions, language) {
    this.__captions[language] = captions;
    return Promise.resolve();
  }

  translate(text, language, currentTime, useCaptionsFromVideo) {
    return new Promise((resolve, reject) => {
      if (useCaptionsFromVideo && currentTime && this.__captions.hasOwnProperty(language)) {
        const nearestCaption = this.findNearestCaption(this.__captions[language], currentTime);
        if (nearestCaption) {
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
