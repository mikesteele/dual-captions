class Adapter {
  constructor() {
    this.player = this.getPlayer();
    this.captionWindow = this.getCaptionWindow();

    // Used to make sure translations are appended to DOM in order of their original element's insertion
    this.orderCounter = 0;

    // Used by the popup to display site-specific information
    // Also used by the provider to store & load caption files
    this.site = '';

    // Used by the provider decide whether to use a loaded caption or Google Translate.
    // Sometimes Google Translate provides a better caption than the loaded one for the current time.
    // This is because captions can be community-generated, using different windows of time for captions.
    this.captionsMayNotMatchUp = false;
  }

  getPlayerCurrentTime() {
    return undefined;
  }

  getVideoId() {
    return undefined;
  }

  // Prevents the appending of the translation from triggering _onMutation()
  _isDCCaption(element) {
    // If it's not an element, it's not a DC caption.
    if (element.nodeType !== 1) {
      return false;
    }
    if (element.tagName === 'BR') {
      return true;
    }
    if (element.classList.contains('dual-captions-window')) {
      return true;
    }
    if (element.hasAttribute('__dc-caption__')) {
      return true;
    }
    if (element.hasAttribute('__dc-break__')) {
      return true;
    }
    return false;
  }

  onPopupOpened() {
    return {
      ok: true
    }
  }

  // Returns true if mutation reflects a caption added to the DOM.
  captionWasAdded(mutation) {
    return false;
  }

  // Get the video player element.
  getPlayer() {
    return document.querySelector('.player');
  }

  // Get the caption window element.
  getCaptionWindow() {
    return document.querySelector('.caption-window');
  }


  // Get the new caption element from a mutation record.
  // Returns element
  getNewCaption(mutation) {
    return mutation.addedNodes[0];
  }

  // Netflix splits captions into two divs.
  // It could take longer for first caption to return from Google Translate
  // So we use this method to get a unique `order` before translating to use later as caption.style.order
  getNewCaptionOrder() {
    return this.orderCounter++;
  }

  // Apply the appropriate style to the translated caption element.
  styleCaptionElement(element) {
    return element;
  }

  // Append the new caption element to the DOM.
  appendToDOM(element) {
    captionWindow.append(element);
  }
}

window.Adapter = Adapter;
