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
    const realCaption = mutation.target.querySelector('span');
    const captionStyle = realCaption.style.cssText;
    element.style = captionStyle;
    element.style.width = `${realCaption.parentNode.scrollWidth}px`;
    element.style.display = 'block';
    element.setAttribute('DC_caption', true);
    return element;
  }

  // Append the new caption element to the caption window.
  appendToCaptionWindow(element) {
    let captionWindow = this.getCaptionWindow();
    if (captionWindow) {
      captionWindow.children[0].appendChild(element);
    }
    const captionWindow2 = captionWindow.children[0];
    if (captionWindow2.style.top) {
      const top = captionWindow2.style.top;
      captionWindow2.style.top = `calc(${top} - ${element.scrollHeight}px)`;
    }
  }

  // Append the new caption to the DOM
  appendToDOM(element, mutation) {
    if (document.querySelector('.dual-captions-window')) {
      console.log('here')
      const dualCaptionsWindow = document.querySelector('.dual-captions-window');
      dualCaptionsWindow.appendChild(element);
    } else {
      console.log('there')
      let dualCaptionsWindow = document.createElement('div');
      dualCaptionsWindow.classList.add('dual-captions-window');
      dualCaptionsWindow.style.position = 'absolute';
      dualCaptionsWindow.style.left = '50%'; // TODO
      const captionWindow = this.getCaptionWindow();
      captionWindow.appendChild(dualCaptionsWindow);
      dualCaptionsWindow.appendChild(element);
    }
    this._repositionNetflixCaptions(element);
    this._repositionDualCaptionsWindow();
  }

  _repositionNetflixCaptions(element) {
    const dualCaptionsWindow = document.querySelector('.dual-captions-window');
    const netflixCaptions = Array.from(document.querySelectorAll('.player-timedtext-text-container:not([DC_caption="true"])'));
    netflixCaptions.forEach(caption => {
      if (caption.hasAttribute('DC_original-top')) {
        caption.style.top = `calc(${caption.getAttribute('DC_original-top')} - ${dualCaptionsWindow.scrollHeight}px)`;
      } else if (caption.hasAttribute('DC_original-bottom')) {
        caption.style.bottom = `calc(${caption.getAttribute('DC_original-bottom')} + ${dualCaptionsWindow.scrollHeight}px)`;
      } else {
        if (caption.style.top) {
          const top = caption.style.top;
          caption.setAttribute('DC_original-top', top);
          caption.style.top = `calc(${top} - ${dualCaptionsWindow.scrollHeight}px)`;
        } else if (caption.style.bottom) {
          const bottom = caption.style.bottom;
          caption.setAttribute('DC_original-bottom', bottom);
          caption.style.bottom = `calc(${bottom} + ${dualCaptionsWindow.scrollHeight}px)`;
        }
      }
    });
  }

  _repositionDualCaptionsWindow() {
    const dualCaptionsWindow = document.querySelector('.dual-captions-window');
    const lastNetflixCaption = Array.from(document.querySelectorAll('.player-timedtext-text-container:not([DC_caption="true"])')).pop();
    if (lastNetflixCaption.hasAttribute('DC_original-top')) {
      const firstNetflixCaption = Array.from(document.querySelectorAll('.player-timedtext-text-container:not([DC_caption="true"])'))[0]
      dualCaptionsWindow.style.top = firstNetflixCaption.getAttribute('DC_original-top');
    } else if (lastNetflixCaption.hasAttribute('DC_original-bottom')) {
      dualCaptionsWindow.style.bottom = lastNetflixCaption.getAttribute('DC_original-bottom');
    }
    
  }
}

window.DC.config = new NetflixConfig();
