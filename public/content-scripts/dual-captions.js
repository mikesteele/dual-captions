class DualCaptions {
  constructor() {
    this.isOn = false;
    this.observer = new window.MutationObserver(this._onMutation.bind(this));
    this.secondLanguage = 'en';
    this.extraSpace = false;
    this.delayRenderingUntilTranslation = true;
    this.useCaptionsFromVideo = true;

    this.provider = window.DC.provider;

    window.chrome.runtime.onMessage.addListener(this._onMessage.bind(this));
  }
  _onMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'change-language':
      this.secondLanguage = message.payload;
      sendResponse({
        ok: true
      });
      this.provider.requestLanguage(this.secondLanguage)
        .then(() => {
          console.log(`Loaded captions for ${this.secondLanguage}`)
        })
        .catch(err => {
          console.log(`Couldn't load translations for ${this.secondLanguage}: ${err}`);
        });
      break;

      case 'change-settings':
      this.extraSpace = message.payload.extraSpace;
      this.delayRenderingUntilTranslation = message.payload.delayRenderingUntilTranslation;
      this.useCaptionsFromVideo = message.payload.useCaptionsFromVideo;
      sendResponse({ok: true});
      break;

      case 'detect-site':
      sendResponse({
        ok: true,
        site: window.DC.config.site
      });
      break;

      case 'get-state':
      sendResponse({
        ok: true,
        isOn: this.isOn,
        secondLanguage: this.secondLanguage,
        settings: {
          extraSpace: this.extraSpace
        }
      });
      break;

      case 'get-language':
      sendResponse({
        ok: true,
        secondLanguage: this.secondLanguage
      });
      break;

      case 'is-on':
      sendResponse({
        ok: true,
        isOn: this.isOn
      });
      break;

      case 'popup-opened':
      // 1. Request /en/
      // Future: This should request the initial langauge of the popup
      this.provider.requestLanguage('en')
        .then(() => {
          console.log(`Loaded captions for 'en'`)
        })
        .catch(err => {
          console.log(`Couldn't load translations for 'en': ${err}`);
        });

      // 2. Tell adapter that the popup was opened
      const response = window.DC.config.onPopupOpened();
      sendResponse({
        ok: response.ok,
        errorType: response.errorType
      });
      break;

      case 'start-observer':
      try {
        this.observer.observe(window.DC.config.getPlayer(), {
          childList: true,
          subtree: true
        });
        this.isOn = true;
        sendResponse({
          ok: true
        });
      } catch(err) {
        sendResponse({
          ok: false,
          errorType: 'no-player'
        });
      }
      break;

      case 'stop-observer':
      this._stopObserver();
      sendResponse({
        ok: true
      });
      break;
    }
  }

  _onMutation(mutationRecords) {
    mutationRecords.forEach(mutation => {
      let captionWasAdded = window.DC.config.captionWasAdded(mutation);
      if (captionWasAdded) {
        const newCaptionOrder = window.DC.config.getNewCaptionOrder();
        let newCaption = window.DC.config.getNewCaption(mutation);
        if (newCaption) {
          this.lastCaption = newCaption.innerText;
          newCaption.classList.add('original-caption');
          if (!this.delayRenderingUntilTranslation) {
            newCaption.classList.add('translated');
          }
          this.provider.translate(
            this.lastCaption,
            this.secondLanguage,
            window.DC.config.getPlayerCurrentTime(),
            this.useCaptionsFromVideo
          ).then(translation => {
            if (!this._translationIsInDOM(translation.text)) {
              let translatedCaption = document.createElement('span');
              translatedCaption.innerText = translation.text;
              translatedCaption.setAttribute('__dc-caption__', true);
              translatedCaption = window.DC.config.styleCaptionElement(translatedCaption, mutation, newCaptionOrder);
              if (this.extraSpace) {
                let breakElement = this._createBreakElement();
                window.DC.config.appendToDOM(breakElement);
              }
              window.DC.config.appendToDOM(translatedCaption);
              newCaption.classList.add('translated');
            } else {
              newCaption.classList.add('translated');
            }
          }).catch(err => {
            console.log(err);
          });
        }
      }
    });
  }
  _stopObserver() {
    this.observer.disconnect();
    this.isOn = false;
  }
  _translationIsInDOM(translation) {
    const captions = Array.from(document.querySelectorAll(`[__dc-caption__]`));
    if (captions.length > 0) {
      const translationsInDOM = captions.map(caption => { return caption.innerText  });
      return translationsInDOM.includes(translation);
    } else {
      return false;
    }
  }
  _createBreakElement() {
    let breakElement = document.createElement('div');
    breakElement.style.cssText = 'height: 10px';
    breakElement.setAttribute('__dc-break__', true);
    return breakElement;
  }
}

window.DC.DUAL_CAPTIONS = new DualCaptions();
