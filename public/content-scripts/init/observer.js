class Observer {
  constructor() {
    this.isOn = false;
    this.observer = new window.MutationObserver(this._onMutation.bind(this));
    this.secondLanguage = 'en';
    this.extraSpace = false;
    this.delayRenderingUntilTranslation = true;
    this.useCaptionsFromVideo = true;

    this.settingsAreDefault = true;

    this.provider = window.DC.provider;

    // Binds
    this._onMessage = this._onMessage.bind(this);

    window.chrome.runtime.onMessage.addListener(this._onMessage);
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
      this.settingsAreDefault = false;
      this.extraSpace = message.payload.extraSpace;
      this.delayRenderingUntilTranslation = message.payload.delayRenderingUntilTranslation;
      this.useCaptionsFromVideo = message.payload.useCaptionsFromVideo;
      sendResponse({ok: true});
      break;

      case 'detect-site':
      sendResponse({
        ok: true,
        site: window.DC.adapter.site
      });
      break;

      case 'get-state':
      // FIXME: Update get-state tests with loadedLanguages when PR #65 goes in
      sendResponse({
        ok: true,
        settingsAreDefault: this.settingsAreDefault,
        isOn: this.isOn,
        secondLanguage: this.secondLanguage,
        settings: {
          extraSpace: this.extraSpace,
          useCaptionsFromVideo: this.useCaptionsFromVideo,
          delayRenderingUntilTranslation: this.delayRenderingUntilTranslation
        },
        loadedLanguages: window.DC.provider.getLoadedLanguages()
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
      this.provider.requestLanguage(this.secondLanguage)
        .then(() => {
          console.log(`Loaded captions for '${this.secondLanguage}'`)
        })
        .catch(err => {
          console.log(`Couldn't load translations for 'en': ${err}`);
        });

      // 2. Tell adapter that the popup was opened
      const response = window.DC.adapter.onPopupOpened();
      sendResponse({
        ok: response.ok,
        errorType: response.errorType
      });
      break;

      case 'start-observer':
      try {
        this.observer.observe(window.DC.adapter.getPlayer(), {
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
      let captionWasAdded = window.DC.adapter.captionWasAdded(mutation);
      if (captionWasAdded) {
        const newCaptionOrder = window.DC.adapter.getNewCaptionOrder();
        let newCaption = window.DC.adapter.getNewCaption(mutation);
        if (newCaption) {
          this.lastCaption = newCaption.innerText;
          newCaption.classList.add('original-caption');
          if (!this.delayRenderingUntilTranslation) {
            newCaption.classList.add('translated');
          }
          this.provider.translate(
            this.lastCaption,
            this.secondLanguage,
            window.DC.adapter.getPlayerCurrentTime(),
            this.useCaptionsFromVideo
          ).then(translation => {
            if (!this._translationIsInDOM(translation.text)) {
              let translatedCaption = document.createElement('span');
              translatedCaption.innerHTML = translation.text; // TODO - Test YouTube & Amazon
              translatedCaption.setAttribute('__dc-caption__', true);
              translatedCaption = window.DC.adapter.styleCaptionElement(translatedCaption, mutation, newCaptionOrder);
              if (this.extraSpace) {
                let breakElement = this._createBreakElement();
                window.DC.adapter.appendToDOM(breakElement);
              }
              window.DC.adapter.appendToDOM(translatedCaption);
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
      const translationsInDOM = captions.map(caption => { return caption.textContent  });
      const renderElement = document.createElement('div'); // TODO - Move out of here
      renderElement.innerHTML = translation;
      return translationsInDOM.includes(renderElement.textContent);
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

window.DC.observer = new Observer();
window.Observer = Observer;
