let captionRequestUrls = {
  youtube: null
}

chrome.webRequest.onBeforeRequest.addListener(
  onBeforeYouTubeCaptionRequest, {
    urls: ['https://www.youtube.com/api/timedtext*']
  }
);

function onBeforeYouTubeCaptionRequest(details) {
  // TODO - Prevent DC triggered calls from being put into object?
  console.log(`Background - Adding ${details.url} to captionRequestUrls`);
  captionRequestUrls.youtube = details.url;
}

/**

The following functions should be in a content script.
Maybe 'TranslationFetcher'

Background script should only have onBeforeRequest handlers and the captionRequestUrls object.
Which it sends to the content_scripts on a certain message.

**/

function fetchLanguage(language) {
  if (captionRequestUrls.youtube) {
    const requestUrl = captionRequestUrls.youtube.replace(/lang=[a-z]+/g, `lang=${language}`);
    console.log(requestUrl);
    console.log(language);
    fetch(requestUrl)
      .then(response => {
        console.log(response.ok);
        // TODO - Is it ever not ok?
        return response.text();
      })
      .then(responseText => {
        if (!responseText) {
          console.log(`No captions available for ${language}`);
          // TODO - Maybe expired?
          // TODO
        }
        console.log(responseText);
      })
      .catch(err => {
        console.log('Got err');
        console.log(err);
      })
  } else {
    console.log('Cant fetch language - no YouTube API call');
    // TODO - Return { ok: false } - No YouTube caption URL
  }
}
