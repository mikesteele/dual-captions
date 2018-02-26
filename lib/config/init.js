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
  }

  // Returns true if mutation reflects a caption added to the DOM.
  captionWasAdded(mutation) {
  	return false;
  }

  // Get the video player element.
  getPlayer() {
  	return document.querySelector(".player");
  }

  // Get the caption window element.
  getCaptionWindow() {
  	return document.querySelector(".caption-window");
  }


  // Get the new caption element from a mutation record.
  // Returns element
  getNewCaptionFromMutation(mutation) {
  	return mutation.addedNodes[0];
  }

  // Get the current caption style from a mutation record.
  // TODO - Should probably use getNewCaptionFrom()
  // Returns cssText
  getCaptionStyleFromMutation(mutation) {
  	return "";
  }

  // Apply the appropriate style to the translated caption element.
  styleCaptionElement(element) {
  	return element;
  }

  // Append the new caption element to the caption window.
  appendToCaptionWindow(element) {
    captionWindow.append(element);
  }
}
