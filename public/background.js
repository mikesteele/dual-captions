// To expose the pattern for testing in src/tests/background.test.js
window.NETFLIX_CAPTION_REQUEST_PATTERN = 'https://*.nflxvideo.net/?o=*&v=*&e=*&t=*';

const netflixCaptionRequestsInFlight = {};

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
      this._onBeforeNetflixCaptionRequest, {
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
    if (!netflixCaptionRequestsInFlight.hasOwnProperty(details.url)) {
      netflixCaptionRequestsInFlight[details.url] = 1;
      sendMessageToActiveTab({
        type: 'process-netflix-caption-request',
        payload: details.url
      }).then(response => {
        delete netflixCaptionRequestsInFlight[details.url];
      }).catch(err => {
        console.log(`Couldn't process Netflix caption request. Error: ${err}`);
        // TODO - delete netflixCaptionRequests[details.url]; ?
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

function getActiveTabId() {
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

function sendMessageToActiveTab(message) {
  return new Promise((resolve, reject) => {
    getActiveTabId()
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
