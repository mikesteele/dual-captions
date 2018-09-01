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
    // TODO - Don't load if there's no currentSite & add test
    const currentSite = this.adapter.site;
    const videoId = this.adapter.getVideoId();
    if (!this.__captions.hasOwnProperty(currentSite)) {
      this.__captions[currentSite] = {};
    }
    if (!this.__captions[currentSite].hasOwnProperty(videoId)) {
      this.__captions[currentSite][videoId] = {};
    }
    this.__captions[currentSite][videoId][language] = captions;
    return Promise.resolve();
  }

  translate(text, language, currentTime, useCaptionsFromVideo) {
    console.log(this.__captions); // TODO - Remove
    return new Promise((resolve, reject) => {
      const currentSite = this.adapter.site;
      const videoId = this.adapter.getVideoId();
      if (useCaptionsFromVideo
          && currentTime
          && currentSite
          && this.__captions.hasOwnProperty(currentSite)
          && this.__captions[currentSite].hasOwnProperty(videoId)
          && this.__captions[currentSite][videoId].hasOwnProperty(language)) {
        const captions = this.__captions[currentSite][videoId][language];
        const nearestCaption = this.findNearestCaption(captions, currentTime);
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
