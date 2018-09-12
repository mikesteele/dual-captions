class NetflixAdapter extends Adapter {
  constructor() {
    super();
    this.site = 'netflix';

    this.addNetflixAPIHook();
  }

  addNetflixAPIHook() {
    // Since content_scripts run an in isolated world, we need to expose the global Netflix API via an element attribute
    // I took inspiration for this from Vue Devtools, which attaches the Vue global on element.__vue__
    // See https://github.com/vuejs/vue-devtools/blob/dev/shells/chrome/src/detector.js#L31
    const script = document.createElement('script');
    script.innerHTML = `document.body.__netflix__ = window.netflix;`;
    document.body.appendChild(script);
  }

  // getVideoId & getPlayerCurrentTime are not needed until Netflix native translation support
  getVideoId() {
    return 'TODO';
  }

  getPlayerCurrentTime() {
    return undefined;
  }

  getPlayerCurrentCaptionLanguage() {
    // TODO - Use document.body.__netflix__ hook
    let videoPlayer, currentSessionId, currentTextTrack;
    try {
      videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
      currentSessionId = videoPlayer.getAllPlayerSessionIds()[0]; // TODO - Can there be multiple? What does it mean?
      currentTextTrack = videoPlayer.getCurrentTextTrackBySessionId(currentSessionId);
    } catch (e) {
      console.log(`Couldn't get the video player from the Netflix API`);
    }
    if (videoPlayer && currentSessionId && currentTextTrack) {
      return currentTextTrack.bcp47;
      // TODO - Compatible with ISO?
    }
  }

  onPopupOpened() {
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
    const captionWindow = this.getCaptionWindow();
    return mutation.target === captionWindow && mutation.addedNodes.length > 0 && !this._isDCCaption(mutation.addedNodes[0]);
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

    const captionWindow = this.getCaptionWindow(); // Do I have the captionWindow in an earlier step?
    captionWindow.appendChild(dcWindow);
    return dcWindow;
  }

  // Apply the appropriate style to the translated caption element.
  styleCaptionElement(element, mutation, captionOrder) {
    const realCaption = mutation.target.querySelector('span');
    const captionStyle = realCaption.style.cssText;
    element.style = captionStyle;
    element.style.width = `calc(${realCaption.parentNode.scrollWidth}px + 300px)`;
    element.style.display = 'block';
    element.style.textAlign = 'center';
    element.style.order = captionOrder;
    return element;
  }

  // Append the new caption to the DOM
  appendToDOM(element) {
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

    dcWindow.style.left = `calc(${firstNetflixCaption.style.left} - 150px)`;
  }
}

window.DC.adapter = new NetflixAdapter();
