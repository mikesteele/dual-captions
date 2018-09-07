class ErrorTestConfig extends DualCaptionsConfig {
  constructor() {
    super();
  }

  // Returns true if mutation reflects a caption added to the DOM.
  captionWasAdded(mutation) {
    return true;
  }

  // Get the video player element.
  getPlayer() {
    return null;
  }

  // Get the caption window element.
  getCaptionWindow() {
    return null;
  }

  // Get the new caption element from a mutation record.
  // Returns element
  getNewCaption(mutation) {
    return mutation.addedNodes[0];
    // TODO: Shoudld test if null?
  }

  // Apply the appropriate style to the translated caption element.
  styleCaptionElement(element, mutation) {
    //
  }

  // Append the new caption element to the DOM
  appendToDOM(element) {
    //
  }
}

window.DC.config = new ErrorTestConfig();
