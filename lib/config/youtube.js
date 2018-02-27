class YouTubeConfig extends DualCaptionsConfig {
  constructor() {
    super();
    this.playerId = "movie_player";
    this.captionWindowClass = "caption-window";
    this.captionClass = "captions-text";
  }

  // Returns true if mutation reflects a caption added to the DOM.
  captionWasAdded(mutation) {
    return mutation.target.classList.contains(this.captionClass) && mutation.addedNodes.length > 0; 
  }

  // Get the video player element.
  getPlayer() {
    return document.getElementById(this.playerId);
  }

  // Get the caption window element.
  getCaptionWindow() {
    return document.querySelector(`.${this.captionWindowClass}`);
  }

  // Get the new caption element from a mutation record.
  // Returns element
  getNewCaption(mutation) {
    return mutation.addedNodes[0];
  }

  // Get the current caption style from a mutation record.
  // TODO - Should probably use getNewCaptionFrom()
  // Returns cssText
  getCaptionStyleFromMutation(mutation) {
    return "";
  }

  // Apply the appropriate style to the translated caption element.
  styleCaptionElement(element, mutation) {
    const captionStyle = mutation.target.querySelector('span').style.cssText;
    element.style = captionStyle;
    element.classList.add(this.captionClass);
    return element;
  }

  // Append the new caption element to the caption window.
  appendToCaptionWindow(element) {
    let captionWindow = this.getCaptionWindow();
    if (captionWindow) {
      captionWindow.appendChild(element);
    }
  }
}

window.DC.config = new YouTubeConfig();
