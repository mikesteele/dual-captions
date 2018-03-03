class NetflixConfig extends DualCaptionsConfig {
  constructor() {
    super();
  }

  // Returns true if mutation reflects a caption added to the DOM.
  captionWasAdded(mutation) {
    const captionWindow = this.getCaptionWindow();
    return mutation.target === captionWindow && mutation.addedNodes.length > 0; 
  }

  // Get the video player element.
  getPlayer() {
    return document.querySelector('.VideoContainer');
  }

  // Get the caption window element.
  getCaptionWindow() {
    return document.querySelector('.player-timedtext');
  }

  // Get the new caption element from a mutation record.
  // Returns element
  getNewCaption(mutation) {
    return mutation.addedNodes[0];
  }

  // Apply the appropriate style to the translated caption element.
  styleCaptionElement(element, mutation) {
    const captionStyle = mutation.target.querySelector('span').style.cssText;
    element.style = captionStyle;
    return element;
  }

  // Append the new caption element to the caption window.
  appendToCaptionWindow(element) {
    let captionWindow = this.getCaptionWindow();
    if (captionWindow) {
      captionWindow.children[0].appendChild(element);
    }
  }
}

window.DC.config = new NetflixConfig();
