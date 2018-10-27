class TranslationProvider {
  constructor() {
    // DC
    this.adapter = window.DC.adapter;
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

  findCaptionForTime(captions, currentTime) {
    const nearestCaption = captions.find(caption => {
      return caption.startTime < currentTime && caption.endTime > currentTime;
    });
    return nearestCaption;
  }

  findCaptionWithStartTime(captions, currentTime) {
    const nearestCaption = captions.find(caption => {
      return Math.abs(currentTime - caption.startTime) < 0.3;
    });
    return nearestCaption;
  }

  findCaption(captions, currentTime, captionsMayNotMatchUp) {
    if (captionsMayNotMatchUp) {
      return this.findCaptionWithStartTime(captions, currentTime);
    } else {
      return this.findCaptionForTime(captions, currentTime);
    }
  }

  getLoadedLanguages() {
    const currentSite = this.adapter.site;
    const videoId = this.adapter.getVideoId();
    if (currentSite
        && videoId
        && this.__captions.hasOwnProperty(currentSite)
        && this.__captions[currentSite].hasOwnProperty(videoId)) {
      return Object.keys(this.__captions[currentSite][videoId]);
    } else {
      return [];
    }
  }

  __loadCaptions(captions, language) {
    const currentSite = this.adapter.site;
    const videoId = this.adapter.getVideoId();
    if (!videoId || !currentSite) {
      return Promise.reject(`Can't load captions, missing videoId or currentSite`);
    }
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
    return new Promise((resolve, reject) => {
      const currentSite = this.adapter.site;
      const videoId = this.adapter.getVideoId();
      if (useCaptionsFromVideo
          && currentTime
          && currentSite
          && this.__captions[currentSite]
          && this.__captions[currentSite][videoId]
          && this.__captions[currentSite][videoId][language]) {
        const captions = this.__captions[currentSite][videoId][language];
        const captionToRender = this.findCaption(captions, currentTime, this.adapter.captionsMayNotMatchUp);
        if (captionToRender) {
          resolve({
            text: `${captionToRender.text} ✓`
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
