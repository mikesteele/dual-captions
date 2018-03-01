class DualCaptions {
  /**
   * Properties
   * 
   * lastCaption - string
   * observer - MutationObserver
   * secondLanguage - string
   */
  constructor() {
    this.isOn = false;
    this.lastCaption = '';
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
        let newCaption = window.DC.config.getNewCaption(mutation);
        if (newCaption && newCaption.textContent !== this.lastCaption) {
          this.lastCaption = newCaption.textContent;
          window.DC.translate(this.lastCaption, {
            from: 'auto',
            to: this.secondLanguage
          }).then(translation => {
            let translatedCaption = document.createElement('span');
            translatedCaption.innerHTML = translation.text;
            translatedCaption = window.DC.config.styleCaptionElement(translatedCaption, mutation);
            window.DC.config.appendToCaptionWindow(document.createElement('br'));
            window.DC.config.appendToCaptionWindow(translatedCaption);
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
}

window.DC.DUAL_CAPTIONS = new DualCaptions();
