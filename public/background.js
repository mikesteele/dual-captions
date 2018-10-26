// To expose the pattern for testing in src/tests/background.test.js
window.NETFLIX_CAPTION_REQUEST_PATTERN = 'https://*.nflxvideo.net/?o=*&v=*&e=*&t=*';

window.netflixCaptionRequestsInFlight = {};

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
        urls: ['https://www.youtube.com/api/timedtext*']
      }
    );
    chrome.webRequest.onBeforeRequest.addListener(
      this._onBeforeNetflixCaptionRequest, {
        urls: [window.NETFLIX_CAPTION_REQUEST_PATTERN]
      }
    );
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
    if (!window.netflixCaptionRequestsInFlight.hasOwnProperty(details.url)) {
      window.netflixCaptionRequestsInFlight[details.url] = 1;
      window.sendMessageToActiveTab({
        type: 'process-netflix-caption-request',
        payload: details.url
      }).then(response => {
        delete window.netflixCaptionRequestsInFlight[details.url];
      }).catch(err => {
        console.log(`Couldn't process Netflix caption request. Error: ${err}`);
      });
    }
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

/**
 *
 * From src/utils/chrome.js
 *
 **/

// FIXME
// It's not documented in the Chrome docs, but people online say that
// you can use chrome.tabs.sendMessage() without current tab ID
// and the message will be sent to the active tab.
// Worth investaging in the future.

window.getActiveTabId = () => {
  return new Promise((resolve, reject) => {
    if (window.chrome && window.chrome.tabs && window.chrome.tabs.query) {
      window.chrome.tabs.query({
        currentWindow: true,
        active: true
      }, tabs => {
        if (tabs && tabs.length > 0) {
          resolve(tabs[0].id);
        } else {
          reject('Could not get active tab ID.');
        }
      });
    } else {
      reject('window.chrome.tabs.query missing')
    }
  });
}

window.sendMessageToActiveTab = (message) => {
  return new Promise((resolve, reject) => {
    window.getActiveTabId()
      .then(tabId => {
        return new Promise(_resolve => {
          window.chrome.tabs.sendMessage(tabId, message, _resolve);
        });
      })
      .then(resolve)
      .catch(err => {
        reject(err);
      });
    });
}



window.DC_BackgroundPage = new BackgroundPage();
