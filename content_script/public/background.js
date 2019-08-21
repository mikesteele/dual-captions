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
      reject('window.chrome.tabs.query missing');
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

class BackgroundPage {
  constructor() {
    // Properties
    this.captionRequestsInFlight = {};
    this.netflixCaptionRequestPattern = 'https://*.nflxvideo.net/?o=*&v=*&e=*&t=*';
    this.youtubeCaptionRequestPattern = 'https://www.youtube.com/api/timedtext*';

    // Binds
    this.onTabUpdated = this.onTabUpdated.bind(this);
    this.onBeforeNetflixCaptionRequest = this.onBeforeNetflixCaptionRequest.bind(this);
    this.onBeforeYouTubeCaptionRequest = this.onBeforeYouTubeCaptionRequest.bind(this);

    // TODO - Need window.chrome?

    // Listeners
    chrome.webRequest.onBeforeRequest.addListener(
      this.onBeforeYouTubeCaptionRequest, {
        urls: [this.youtubeCaptionRequestPattern]
      }
    );
    chrome.webRequest.onBeforeRequest.addListener(
      this.onBeforeNetflixCaptionRequest, {
        urls: [this.netflixCaptionRequestPattern]
      }
    );
    chrome.tabs.onUpdated.addListener(this.onTabUpdated);
  }

  onBeforeNetflixCaptionRequest(details) {
    // TODO - Do you get requesting tabId in details?
    if (!(details.url in this.captionRequestsInFlight)) {
      this.captionRequestsInFlight[details.url] = 1;
      window.sendMessageToActiveTab({
        type: 'process-caption-request',
        payload: details.url,
        site: 'netflix' // Pass site so a DC instance can ignore if site doesn't match
      }).then(response => {
        // TODO - delete this.captionRequestsInFlight[details.url];
      }).catch(err => {
        console.log(`Couldn't process Netflix caption request. Error: ${err}`);
      });
    }
  }

  onBeforeYouTubeCaptionRequest(details) {
    // TODO - Do you get requesting tabId in details?
    if (!(details.url in this.captionRequestsInFlight)) {
      this.captionRequestsInFlight[details.url] = 1;
      window.sendMessageToActiveTab({
        type: 'process-caption-request',
        payload: details.url,
        site: 'youtube' // Pass site so a DC instance can ignore if site doesn't match
      }).then(response => {
        // TODO - delete this.captionRequestsInFlight[details.url];
      }).catch(err => {
        console.log(`Couldn't process YouTube caption request. Error: ${err}`);
      });
    }
  }

  onTabUpdated(tabId, changeInfo, tab) {
    if (tabId && changeInfo.url) {
      // TODO - Could optimize?
      window.chrome.tabs.sendMessage(tabId, {
        type: 'tab-updated-url'
      }, response => {
        // TODO - Need to do anything? Probably not.
      });
    }
  }
}

window.background = new BackgroundPage();
