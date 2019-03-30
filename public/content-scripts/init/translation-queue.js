class TranslationQueue {
  constructor() {
    /**
     *  text: string
     *  isResolved: boolean
     *  callback: (language) => void
     *  TODO - URL?
     *  TODO - Language?
     */
    this._queue = [];

    this.onMessage = this.onMessage.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.updatePopupIcon = this.updatePopupIcon.bind(this);
    this.resolveTranslation = this.resolveTranslation.bind(this);
    this.setIconToNormal = this.setIconToNormal.bind(this);
    this.setIconToHasNotification = this.setIconToHasNotification.bind(this);

    window.chrome.runtime.onMessage.addListener(this.onMessage);
  }

  onMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'get-unresolved-requests':
      const unresolvedRequests = this._queue.filter(i => !i.isResolved).map(i => ({ text: i.text, index: this._queue.indexOf(i) }));
      sendResponse({
        ok: true,
        payload: unresolvedRequests
      });
      break;

      case 'resolve-translation':
      const payload = message.payload;
      if (payload && 'index' in payload && payload.language) {
        this.resolveTranslation(payload.index, payload.language);
        sendResponse({
          ok: true
        });
      } else {
        sendResponse({
          ok: false,
          error: 'Missing payload, index or language'
        });
      }
    }
  }

  addToQueue(text) {
    return new Promise((resolve, reject) => {
      this._queue.push({
        text: text,
        isResolved: false,
        callback: resolve
      });
      this.updatePopupIcon();
    });
  }

  resolveTranslation(index, language) {
    if (this._queue[index] && !this._queue[index].isResolved) {
      this._queue[index].isResolved = true;
      this._queue[index].callback(language);
    }
    this.updatePopupIcon();
  }

  updatePopupIcon() {
    const hasUnresolvedRequests = this._queue.some(i => !i.isResolved);
    if (hasUnresolvedRequests) {
      this.setIconToHasNotification();
    } else {
      this.setIconToNormal();
    }
  }

  setIconToNormal() {
    // TODO - Send message to background page
  }

  setIconToHasNotification() {
    // TODO - Send message to background page
  }
}

window.DC.translationQueue = new TranslationQueue;
window.TranslationQueue = TranslationQueue;
