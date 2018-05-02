class DualCaptionsConfig {
  /**
   *
   * Properties
   * 
   * player - Video player element, captionWindow is a child
   * captionWindow - Element that contains the captions
   *
   */
  constructor() {
    this.player = this.getPlayer();
    this.captionWindow = this.getCaptionWindow();
    this.orderCounter = 0;
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
