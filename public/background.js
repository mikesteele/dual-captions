/**

TODO

Should be video specific?

https://www.youtube.com/api/timedtext?expire=1532998159&caps=asr&v=4INdeZ5HYpw&hl=en_US&sparams=asr_langs%2Ccaps%2Cv%2Cxorp%2Cexpire&xorp=True&asr_langs=es%2Cpt%2Cru%2Cko%2Cit%2Cde%2Cfr%2Cnl%2Cja%2Cen&key=yttt1&signature=2E87F5D3FA5E783C30607D39C27E6BEB48F3F21F.3DDF41F633464F2CEA29967B8006416A8B5F7470&lang=es&fmt=srv3

Comes with video key of `v=ID`

captionRequestUrls = {
  youtube: {
    <ID>: 'https...',
    <ID2>: 'https...'
  }
}

---

TODO - Notes

Popup requests second language change

DC receives message, asks TranslationProvider if it has lang

If it has it loaded, it sends a response back to the popup to indicate to the user (green dot in dropdown)

If it doesn't have it loaded, it asks TranslationFetcher to try fetching it

TranslationFetcher asks background page for a URL to use to fetch (background page should've intercepted a subtitle URL)

TranslationFetcher error cases:
* Background page has no URL for this video - did the user turn on subtitles?
* Fetch caught - reason unknown
* Response was ok but body is empty - no static captions available for this lang

If fetch is successful, TranslationFetcher passes the body to a TranslationParser

TranslationParser parses the file and loads the translations into TranslationProvider

---

New files

TranslationParser
TranslationFetcher
TranslationProvider

New file structure

public/content-scripts/youtube/adapter|provider|fetcher|parser|css?

**/

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
  // TODO - save to video-specific key
}

/**

The following functions should be in a content script.
Maybe 'TranslationFetcher'

Background script should only have onBeforeRequest handlers and the captionRequestUrls object.
Which it sends to the content_scripts on a certain message.

**/

// TODO - Should take language, videoID
// TODO - Add videoId to DC adapter - window.DC.adapter.videoID
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
