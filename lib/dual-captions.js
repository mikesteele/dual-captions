class DualCaptions {
  /**
   * Properties
   * 
   * observer - MutationObserver
   * secondLanguage - string
   */
  constructor() {
    this.isOn = false;
    this.observer = new MutationObserver(this._onMutation.bind(this));
    this.secondLanguage = 'en';

    chrome.runtime.onMessage.addListener(this._onMessage.bind(this));
  }
  _onMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'change-language':
      this.secondLanguage = message.info.lang;
      break;

      case 'get-language':
      sendResponse(this.secondLanguage);
      break;

      case 'is-on':
      sendResponse(this.isOn);
      break;

      case 'start-observer':
      this._startObserver();
      break;

      case 'stop-observer':
      this._stopObserver();
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
          window.DC.translate(this.lastCaption, {
            from: 'auto',
            to: this.secondLanguage
          }).then(translation => {
            if (!this._translationIsInDOM(translation.text)) {
              let translatedCaption = document.createElement('span');
              translatedCaption.innerHTML = translation.text;
              translatedCaption.setAttribute('__dc-caption__', true);
              translatedCaption = window.DC.config.styleCaptionElement(translatedCaption, mutation, newCaptionOrder);
              window.DC.config.appendToDOM(translatedCaption, mutation);
            }
          });
        }
      }
    });
  }
  _startObserver() {
    this.observer.observe(window.DC.config.getPlayer(), {
      childList: true,
      subtree: true
    });
    this.isOn = true;
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
}

window.DC.DUAL_CAPTIONS = new DualCaptions();
