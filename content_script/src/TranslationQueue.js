import React from 'react';

class TranslationQueue extends React.Component {
  constructor(props) {
    super(props);

    /**
     *  text: string
     *  isResolved: boolean
     *  callbacks: [(language) => void]
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
  }

  componentDidMount() {
    window.chrome.runtime.onMessage.addListener(this.onMessage);
  }

  componentWillUnmount() {
    window.chrome.runtime.onMessage.removeListener(this.onMessage);
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
      const index = this._queue.findIndex(i => i.text === payload.text);
      if (payload &&
          payload.text &&
          payload.language &&
          index > -1) {
        this.resolveTranslation(index, payload.language);
        sendResponse({
          ok: true,
          payload: this._queue
        });
      } else {
        sendResponse({
          ok: false,
          error: 'Missing payload, text or language - or text is not in queue'
        });
      }
      break;

      case 'get-queue':
      sendResponse({
        ok: true,
        payload: this._queue
      });
      break;
    }
  }

  // TODO - Rename to requestLanguageFromUser()?
  addToQueue(text) {
    return new Promise((resolve, reject) => {
      const isInQueue = this._queue.find(i => i.text === text);
      if (isInQueue) {
        if (isInQueue.isResolved) {
          resolve(isInQueue.language);
        } else {
          isInQueue.callbacks.push(resolve);
        }
      } else {
        this._queue.push({
          text: text,
          isResolved: false,
          language: undefined,
          callbacks: [resolve]
        })
      }
      this.updatePopupIcon();
    });
  }

  resolveTranslation(index, language) {
    if (this._queue[index] && !this._queue[index].isResolved) {
      this._queue[index].isResolved = true;
      this._queue[index].language = language;
      this._queue[index].callbacks.forEach(cb => cb(language));
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

  render() {
    const queue = {
      addToQueue: this.addToQueue
    };
    return this.props.children(queue);
  }
}

export default TranslationQueue;
