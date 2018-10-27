## dual-captions <br/> Subtitles in two languages for YouTube, Netflix and Amazon Video
![build](https://travis-ci.com/mikesteele/dual-captions.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/mikesteele/dual-captions/badge.svg?branch=master)](https://coveralls.io/github/mikesteele/dual-captions?branch=master)

| Netflix  |
|:--------:|
| <img src="https://raw.githubusercontent.com/mikesteele/dual-captions-gifs/master/netflix.png"> |

| YouTube      | Amazon        |
|:-------------:|:-------------:|
| <img src="https://raw.githubusercontent.com/mikesteele/dual-captions-gifs/master/youtube.png"> | <img src="https://raw.githubusercontent.com/mikesteele/dual-captions-gifs/master/amazon.png"> |

### <a href="https://www.youtube.com/watch?v=grYMOv9K3kY" target="_blank">Watch video demo</a>
### Fast Facts

* Targeted at **language learners** who need what the speaker is saying and the translation in user's native language.
* 100+ languages supported. 🌎
* Uses captions from video if available. (YouTube only, Netflix & Amazon support coming)
* If second language is unavailable, it uses Google Translate to translate captions into target language.
* Free! No API key required.

### Intro

As someone learning a foreign language, it is helpful for me to see both what the speaker is saying and the translation.

This Chrome Extension creates a MutationObserver which waits for new caption elements to be added to the DOM. It then translates the text of these captions and adds the translated captions underneath.  If the video has subtitles in the second language, it uses those subtitles as translations and marks them with a ✓. (YouTube only, Netflix & Amazon coming soon)

### File Structure

````
|-- public/                    Content scripts & background page
    |-- content-scripts/
       |-- amazon/             Amazon adapter
       |-- init/               Initialization scripts
          |-- adapter.js       Adapter  - knows what the DOM for this video site looks like
          |-- observer.js      Observer - watches DOM for new captions
          |-- provider.js      Provider - provides translations to Observer
       |-- netflix/            Netflix adapter
       |-- stylesheets/        Stylesheets-to-inject
       |-- test/               Test adapters
       |-- utils/              Google Translate API, etc
       |-- youtube/            YouTube adapter, subtitle fetcher, and subtitle parser
    |-- locales/               Popup UI translation files
    |-- background.js          Background page
    |-- manifest.json          Extension manifest


|-- src/                       Popup UI
    |-- components/            React components
    |-- tests/                 Tests for popup, content scripts, and background page
    |-- actions.js             Redux thunks
    |-- middleware.js          Redux middleware
    |-- reducer.js             Redux reducer
````


### Usage

Download on the Google Web Store: https://chrome.google.com/webstore/detail/dual-captions/lpeonmjfimoijceaalocpgjjchocbiap

#### Manual Installation

Building the extension locally requires having Node and Yarn installed. See https://nodejs.org/ and https://yarnpkg.com/ for installation steps.

1. Install dependencies and build the extension.

````
yarn install
yarn build
````

2. Load the /build/ directory as an unpacked extension in chrome://extensions

You'll need to enable Developer Mode in chrome://extensions to do this. See https://developer.chrome.com/extensions/getstarted#unpacked for more information.

#### Run Tests

Tests are stored in `src/tests`. You can run tests by calling:

```
yarn test
```

### License

MIT
