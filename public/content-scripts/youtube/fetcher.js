class YoutubeTranslationFetcher extends TranslationFetcher {
  constructor() {
    super();
  }

  fetchCaptions(language, videoId) {
    return new Promise((resolve, reject) => {
      this.askBackgroundForCaptionRequestUrls()
        .then(captionRequestUrls => {
          if (captionRequestUrls.youtube[videoId]) {
            let requestUrl = captionRequestUrls.youtube[videoId];
            requestUrl = requestUrl.replace(/lang=[a-z]+/g, `lang=${language}`);
            fetch(requestUrl)
              .then(response => response.text())
              // TODO - If expired, is response.ok here?
              .then(responseText => {
                if (responseText) {
                  // TODO - Should check for responseText.length?
                  resolve(responseText);
                } else {
                  reject('No captions available for this language');
                  // TODO - If expired, is this case called?
                }
              })
              .catch(err => {
                reject(`Couldn't fetch captions.`);
                // TODO - Why?
              });
          } else {
            reject('No caption request URL found for this video. Has the user turned on captions?');
          }
        })
        .catch(reject);
    });
  }
}

window.DC.fetcher = new YoutubeTranslationFetcher();
