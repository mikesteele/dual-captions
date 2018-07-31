class TranslationFetcher {
  constructor() {
    // TODO - Binds?
  }

  askBackgroundForCaptionRequestUrls() {
    return new Promise((resolve, reject) => {
      window.chrome.runtime.sendMessage({
        type: 'get-caption-request-urls'
      }, response => {
        if (!response || !response.ok || !response.captionRequestUrls) {
          reject(`Couldn't get captionRequestUrls from the background.`);
        } else {
          resolve(response.captionRequestUrls);
          // TODO - Should be response.payload.captionRequestUrls ?
        }
      });
    });
  }

  fetchCaptions(language, videoId) {
    return Promise.reject('TranslationFetcher.fetchCaptions must be implemented.');
  }
}

window.TranslationFetcher = TranslationFetcher;
