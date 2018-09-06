// To expose the pattern for testing in src/tests/background.test.js
window.NETFLIX_CAPTION_REQUEST_PATTERN = 'https://*.nflxvideo.net/?o=*&v=*&e=*&t=*';

class BackgroundPage {
  constructor() {
    // Props
    this.captionRequestUrls = {
      youtube: {}
    }

    // Methods
    this._onMessage = this._onMessage.bind(this);
    this._onBeforeYouTubeCaptionRequest = this._onBeforeYouTubeCaptionRequest.bind(this);

    // Listeners
    chrome.runtime.onMessage.addListener(this._onMessage);
    chrome.webRequest.onBeforeRequest.addListener(
      this._onBeforeYouTubeCaptionRequest, {
        urls: [window.NETFLIX_CAPTION_REQUEST_PATTERN]
      }
    );
    chrome.webRequest.onBeforeRequest.addListener(
      this._onBeforeNetflixCaptionRequest, {
        urls: ['https://*.nflxvideo.net/?o=*&v=*&e=*&t=*']
        // TODO - Test!!
      }
    )
  }

  _onBeforeYouTubeCaptionRequest(details) {
    const url = new URL(details.url);
    const videoId = url.searchParams.get('v');

    if (videoId) {
      url.searchParams.delete('name');
      // ^ 'Named' subtitle requests are not supported at this time.
      // For more information, see https://github.com/mikesteele/dual-captions/issues/57
      this.captionRequestUrls.youtube[videoId] = url.href;
      console.log(`Background - Adding ${details.url} to captionRequestUrls.youtube.${videoId}`);
    }
  }

  _onBeforeNetflixCaptionRequest(details) {
    chrome.runtime.sendMessage({
      type: 'process-netflix-caption-request',
      payload: details.url
    }, response => {
      console.log(response);
      // TODO - ?
    });
  }

  _onMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'get-caption-request-urls':
      sendResponse({
        ok: true,
        captionRequestUrls: this.captionRequestUrls
      });
      break;
    }
  }
}

window.DC_BackgroundPage = new BackgroundPage();
