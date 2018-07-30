/**

TODO

/&v=(\w+)&/g

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
  youtube: {}
}

chrome.webRequest.onBeforeRequest.addListener(
  onBeforeYouTubeCaptionRequest, {
    urls: ['https://www.youtube.com/api/timedtext*']
  }
);

function onBeforeYouTubeCaptionRequest(details) {
  // TODO - Prevent DC triggered calls from being put into object?
  const videoIdPattern = /&v=(\w+)&/g;
  if (videoIdPattern.test(details.url)) {
    console.log(videoIdPattern.exec(details.url));
    // TODO - FIXME - Why is this null? ^
    const videoId = videoIdPattern.exec(details.url)[1];
    captionRequestUrls.youtube[videoId] = details.url;
    console.log(`Background - Adding ${details.url} to captionRequestUrls.youtube.${videoId}`);
  }
}

function onMessage(message, sender, sendResponse) {
  switch (message.type) {
    case 'get-caption-request-urls':
    sendResponse({
      ok: true,
      captionRequestUrls: captionRequestUrls
    });
    break;

    default:
    // TODO - Do I need a default case?
    break;
  }
}

chrome.runtime.onMessage.addListener(onMessage);
