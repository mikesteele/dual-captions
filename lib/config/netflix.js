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

  // Get all Netflix captions in DOM
  getNetflixCaptions() {
    return Array.from(document.querySelectorAll('.player-timedtext-text-container:not([__dc_caption__])'));
  }

  // Get the DC window
  getDCWindow() {
    return document.querySelector('.dual-captions-window');
  }

  // Create the DC window
  makeDCWindow() {
    let dcWindow = document.createElement('div');
    dcWindow.classList.add('dual-captions-window'); // TODO: Use attr
    dcWindow.style.position = 'absolute';
    dcWindow.style.display = 'flex';
    dcWindow.style.flexDirection = 'column';
    dcWindow.style.alignItems = 'center';

    const captionWindow = this.getCaptionWindow(); // Do I have the captionWindow in an earlier step?
    captionWindow.appendChild(dcWindow);
    return dcWindow;
  }

  // Apply the appropriate style to the translated caption element.
  styleCaptionElement(element, mutation) {
    const realCaption = mutation.target.querySelector('span');
    const captionStyle = realCaption.style.cssText;
    element.style = captionStyle;
    element.style.width = `${realCaption.parentNode.scrollWidth}px`;
    element.style.display = 'block';
    return element;
  }

  // Append the new caption to the DOM
  appendToDOM(element, mutation) { // TODO - Does this need `mutation`?
    let dcWindow = this.getDCWindow();
    if (!dcWindow) {
      dcWindow = this.makeDCWindow();
    }
    dcWindow.appendChild(element);
    this._repositionNetflixCaptions(dcWindow);
  }

  // Save the original position (top or bottom) of a caption
  _saveOriginalPosition(caption) {
    if (caption.style.top) {
      const top = caption.style.top;
      caption.setAttribute('__original-top__', top);
      caption.setAttribute('__has-original-position__', true);
    } else if (caption.style.bottom) {
      const bottom = caption.style.bottom;
      caption.setAttribute('__original-bottom__', bottom);
      caption.setAttribute('__has-original-position__', true);
    }
  }


  // Move Netflix captions up to make room for the new captions
  _repositionNetflixCaptions(dcWindow) {
    const netflixCaptions = this.getNetflixCaptions();

    // Values needed to calculate new top/bottoms of Netflix captions
    const netflixCaptionsHeight = netflixCaptions.reduce((sum, caption) => {
      return sum + caption.scrollHeight
    }, 0);
    const dcWindowHeight = dcWindow.scrollHeight;
    const heightDiff = dcWindowHeight - netflixCaptionsHeight;

    netflixCaptions.forEach(caption => {
      if (!caption.hasAttribute('__has-original-position__')) {
        this._saveOriginalPosition(caption);
      }
      if (caption.hasAttribute('__original-top__')) {
        caption.style.top = `calc(${caption.getAttribute('__original-top__')} - ${netflixCaptionsHeight}px - ${heightDiff}px)`;
      } else if (caption.hasAttribute('__original-bottom__')) {
        caption.style.bottom = `calc(${caption.getAttribute('__original-bottom__')} + ${dcWindowHeight}px)`;
      }
    });
    this._repositionDCWindow(dcWindow, netflixCaptions, heightDiff);
  }

  // Move the DC window above or below the Netflix captions, depending on if they have top or bottom.
  _repositionDCWindow(dcWindow, netflixCaptions, heightDiff) {
    const firstNetflixCaption = netflixCaptions[0];
    const lastNetflixCaption = netflixCaptions[netflixCaptions.length - 1];

    if (lastNetflixCaption.hasAttribute('__original-top__')) {
      dcWindow.style.top = `calc(${firstNetflixCaption.getAttribute('__original-top__')} - ${heightDiff}px)`;
    } else if (lastNetflixCaption.hasAttribute('__original-bottom__')) {
      dcWindow.style.bottom = `calc((${lastNetflixCaption.getAttribute('__original-bottom__')})`;
    }

    dcWindow.style.left = firstNetflixCaption.style.left;
  }
}

window.DC.config = new NetflixConfig();
