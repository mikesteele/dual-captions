class DualCaptions {
  /**
   * Properties
   * 
   * lastCaption - string
   * observer - MutationObserver
   */
  constructor() {
    this.lastCaption = "";
    this.observer = new MutationObserver(this._onMutation);

    chrome.extension.onMessage.addListener(this._onMessage);

    // TODO - Remove
    this._startObserver();
  }
  _onMessage(request, sender) {
    console.log(`request: ${request}, sender: ${sender}`);
    // TODO
    //
    // Message types:
    // - Start observer
    // - Stop observer
    // - Change options (language, spacing, color) 
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
            to: 'en'
          }).then(translation => {
            let translatedCaption = document.createElement("span");
            translatedCaption.innerHTML = translation.text;
            translatedCaption = window.DC.config.styleCaptionElement(translatedCaption);
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
  }
}

window.DC.DUAL_CAPTIONS = new DualCaptions();
