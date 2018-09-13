class YouTubeAdapter extends Adapter {
  constructor() {
    super();
    this.site = "youtube";
    this.playerId = "movie_player";
    this.captionWindowClass = "ytp-caption-window-bottom";
    this.captionClass = "captions-text";
  }

  addYoutubeAPIHook() {
    // Since content_scripts run in an isolated world, we need to expose the global YouTube API via an element attribute
    const script = document.createElement('script');
    script.innerHTML = `document.body.__ytplayer__ = window.ytplayer;`;
    document.body.appendChild(script);
  }

  getAvailableCaptionLanguages() {
  	// TODO - Use document.body.__ytplayer__
  	try {
	  const t = JSON.parse(ytplayer.config.args.player_response);
	  const captionTracks = t.captions.playerCaptionsTracklistRenderer.captionTracks;
	  const availableLanguages = captionTracks.map(track => {
	    return track.vssId
	  });
	  console.log(availableLanguages);
	} catch(e) {
	  console.log(`Couldn't detect available languages from YouTube.`);
	}
  }

  getVideoId() {
    const url = new URL(window.location.href);
    return url.searchParams.get('v');
  }

  onPopupOpened() {
    /**

    This sends an alert to the popup that automatic captions (.ytp-caption-window-rollup) aren't supported.

    **/
    const automaticSubtitles = document.querySelector('.ytp-caption-window-rollup');
    if (automaticSubtitles) {
      return {
        ok: false,
        errorType: 'automatic-subtitles'
      }
    } else {
      return {
        ok: true
      }
    }
  }

  // Returns true if mutation reflects a caption added to the DOM.
  captionWasAdded(mutation) {
    return mutation.target.classList.contains(this.captionClass) && mutation.addedNodes.length > 0;
  }

  getPlayerCurrentTime() {
    const player = this.getPlayer();
    if (!player) {
      return;
    }
    const video = player.querySelector('video');
    if (video) {
      return video.currentTime;
    }
  }

  // Get the video player element.
  getPlayer() {
    return document.getElementById(this.playerId);
  }

  // Get the caption window element.
  getCaptionWindow() {
    return document.querySelector(`.${this.captionWindowClass}:not(.ytp-caption-window-rollup)`);
    // Automatic captions (.ytp-caption-window-rollup) won't work, so we prevent using them.
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
    element.classList.add(this.captionClass);
    return element;
  }

  // Append the new caption element to the DOM
  appendToDOM(element) {
    let captionWindow = this.getCaptionWindow();
    if (captionWindow) {
      captionWindow.appendChild(document.createElement('br'));
      captionWindow.appendChild(element);
    }
  }
}

window.DC.adapter = new YouTubeAdapter();
