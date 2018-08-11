class AmazonPrimeConfig extends DualCaptionsConfig {
  constructor() {
    super();
    this.site = 'amazon';
  }

  getPlayer() {
    return document.getElementById('dv-web-player');
  }

  // getVideoId & getPlayerCurrentTime are not needed until Amazon native translation support
  getVideoId() {
    return 'TODO';
  }

  getPlayerCurrentTime() {
    return undefined;
  }

  captionWasAdded(mutation) {
    return mutation.target.classList.contains('timedTextBackground') && mutation.addedNodes.length > 0 && !this._isDCCaption(mutation.addedNodes[0]);
  }

  getNewCaption(mutation) {
    return mutation.target;
  }

  appendToDOM(element) {
    const captionWindow = document.querySelector('.timedTextBackground');
    captionWindow.appendChild(document.createElement('br'));
    captionWindow.appendChild(element);
  }
}

window.DC.config = new AmazonPrimeConfig();
