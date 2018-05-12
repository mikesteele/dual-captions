class DualCaptions {
  constructor() {
    this.isOn = false;
    this.observer = new window.MutationObserver(this._onMutation.bind(this));
    this.secondLanguage = 'en';
    this.extraSpace = false;

    window.chrome.runtime.onMessage.addListener(this._onMessage.bind(this));
  }
  _onMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'change-language':
      this.secondLanguage = message.payload;
      sendResponse({ok: true});
      break;

      case 'change-settings':
      this.extraSpace = message.payload.extraSpace;
      sendResponse({ok: true});
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
          window.DC.translate(this.lastCaption, {
            from: 'auto',
            to: this.secondLanguage
          }).then(translation => {
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
            }
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
  /**
  
  TODO
  ----

  Future architecture:

  DC.js - controls MutationObserver, listens to messages, passes mutations to an adaptor, doesn't create elements.
  Base Adaptor - move _onMutation logic to a method on the adaptor, no need for child adaptors to implement method.
  Adaptor - creates elements, repositions elements, determines if a mutation should be acted upon, 

  DC shouldn't interact with DOM besides listening for mutations. Base adaptor handles checking the DOM for duplicates, appending elements, etc.

  **/
  _createBreakElement() {
    let breakElement = document.createElement('div');
    breakElement.style.cssText = 'height: 10px';
    return breakElement;
  }
}

window.DC.DUAL_CAPTIONS = new DualCaptions();
