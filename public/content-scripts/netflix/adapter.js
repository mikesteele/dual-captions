class NetflixAdapter extends Adapter {
  constructor() {
    super();
    this.site = 'netflix';
  }

  createTextElement() {
    // TODO - Add test that adding a text element doesn't trigger _onMutation
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('__dc-caption__', true);
    return textElement;
  }

  getVideoId() {
    const videoIdPattern = /watch\/(\d+)/;
    const pathname = window.location.pathname;
    if (videoIdPattern.test(pathname)) {
      return videoIdPattern.exec(pathname)[1];
    } else {
      return undefined;
    }
  }

  getPlayerCurrentTime() {
    const video = document.querySelector('video');
    if (video) {
      return video.currentTime;
    } else {
      return undefined;
    }
  }

  onPopupOpened() {
    // TODO - New error message
    /**

    Chinese and Japanese subtitles use images (.image-based-timed-text) to render, which aren't translatable.
    This sends an alert to the popup that they aren't supported by DC.

    **/
    const imageSubtitles = document.querySelector('.image-based-timed-text');
    if (imageSubtitles) {
      return {
        ok: false,
        errorType: 'image-subtitles'
      }
    } else {
      return {
        ok: true
      }
    }
  }

  // Returns true if mutation reflects a caption added to the DOM.
  captionWasAdded(mutation) {
    if (this.isRenderingImageCaptions()) {
      const imageCaptionWindow = this.getImageCaptionWindow();
      return mutation.target === imageCaptionWindow
        && mutation.addedNodes.length > 0
        && mutation.addedNodes[0].tagName === 'image';
    } else {
      const captionWindow = this.getCaptionWindow();
      return mutation.target === captionWindow
        && mutation.addedNodes.length > 0
        && !this._isDCCaption(mutation.addedNodes[0]);
    }
  }

  getImageCaptionWindow() {
    const imageCaptionWindow = document.querySelector('.image-based-timed-text');
    if (imageCaptionWindow && imageCaptionWindow.firstChild.tagName === 'svg') {
      return imageCaptionWindow.firstChild;
    } else {
      return null;
    }
  }

  // Get the video player element.
  getPlayer() {
    return document.querySelector('.nf-player-container');
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

  // TODO - Should be _isRenderingImageCaptions?
  isRenderingImageCaptions() {
    return !!document.querySelector('.image-based-timed-text');
  }

  // Create the DC window
  makeDCWindow() {
    let dcWindow = document.createElement('div');
    dcWindow.classList.add('dual-captions-window'); // TODO: Use attr
    dcWindow.style.position = 'absolute';
    dcWindow.style.display = 'flex';
    dcWindow.style.flexDirection = 'column';

    const captionWindow = this.getCaptionWindow(); // Do I have the captionWindow in an earlier step?
    captionWindow.appendChild(dcWindow);
    return dcWindow;
  }

  // Apply the appropriate style to the translated caption element.
  styleCaptionElement(element, mutation, captionOrder) {
    if (!this.isRenderingImageCaptions()) {
      const realCaption = mutation.target.querySelector('span');
      const captionStyle = realCaption.style.cssText;
      element.style = captionStyle;
      element.style.width = `calc(${realCaption.parentNode.scrollWidth}px + 300px)`;
      element.style.display = 'block';
      element.style.textAlign = 'center';
      element.style.order = captionOrder;
    }
    return element;
  }

  // Append the new caption to the DOM
  appendToDOM(element) {
    if (this.isRenderingImageCaptions()) {
      /**

      This is will removed in v2, when DC won't use Netflix's caption window to render.

      **/
      const captionToRender = element.innerHTML;
      const captionElementToRender = this.createTextElement();
      const imageCaptionWindow = this.getImageCaptionWindow();
      captionElementToRender.innerHTML = captionToRender;
      // TODO - Style
      const existingImageCaption = imageCaptionWindow.firstChild.tagName === 'image' ? imageCaptionWindow.firstChild : null;
      captionElementToRender.setAttribute('fill', 'white');
      captionElementToRender.setAttribute('font-size', '36');
      if (existingImageCaption) {
        captionElementToRender.setAttribute('x', parseInt(existingImageCaption.getAttribute('x')));
        captionElementToRender.setAttribute('y', parseInt(existingImageCaption.getAttribute('y')) + 100);
      }
      if (imageCaptionWindow && existingImageCaption) {
        imageCaptionWindow.appendChild(captionElementToRender);
      }
    } else {
      let dcWindow = this.getDCWindow();
      if (!dcWindow) {
        dcWindow = this.makeDCWindow();
      }
      dcWindow.appendChild(element);
      this._repositionNetflixCaptions(dcWindow);
    }
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

    dcWindow.style.left = `calc(${firstNetflixCaption.style.left} - 150px)`;
  }
}

window.DC.adapter = new NetflixAdapter();
