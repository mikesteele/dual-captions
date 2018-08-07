class YouTubeTranslationFetcher extends TranslationFetcher {
  fetchCaptions(language, videoId) {
    return new Promise((resolve, reject) => {
      this.askBackgroundForCaptionRequestUrls()
        .then(captionRequestUrls => {
          if (captionRequestUrls.youtube[videoId]) {
            let url = new URL(captionRequestUrls.youtube[videoId]);
            url.searchParams.set('lang', language);
            fetch(url.href)
              .then(response => {
                if (response.ok) {
                  return response.text();
                } else {
                  return Promise.reject('Credentials expired.')
                }
              })
              .then(responseText => {
                if (responseText && responseText.length) {
                  resolve(responseText);
                } else {
                  reject('No captions available for this language');
                }
              })
              .catch(err => {
                reject(`Couldn't fetch captions.`);
              });
          } else {
            reject('No caption request URL found for this video. Has the user turned on captions?');
          }
        })
        .catch(reject);
    });
  }
}

window.DC.fetcher = new YouTubeTranslationFetcher();
