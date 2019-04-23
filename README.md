## dual-captions <br/> Subtitles in two languages for YouTube & Netflix
![build](https://travis-ci.com/mikesteele/dual-captions.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/mikesteele/dual-captions/badge.svg)](https://coveralls.io/github/mikesteele/dual-captions)

### ⚠️ Note: Version 2 is currently being developed <a href="https://github.com/mikesteele/dc2">in a seperate repo</a>. Learn about the motivations for a rewrite in that repo's README.

| YouTube      | Netflix       |
|:-------------:|:-------------:|
| <img src="https://raw.githubusercontent.com/mikesteele/dual-captions-gifs/master/youtube.png"> | <img src="https://raw.githubusercontent.com/mikesteele/dual-captions-gifs/master/netflix.png"> |

### <a href="https://www.youtube.com/watch?v=grYMOv9K3kY" target="_blank">Watch video demo</a>

### Intro

As someone learning a foreign language, it is helpful for me to see both what the speaker is saying and the translation.

This Chrome Extension listens for caption requests from YouTube & Netflix, replays them, parses their content, and loads them for use as second captions. It also creates a MutationObserver which waits for new caption elements to be added to the DOM. Once it sees a new caption was added, it checks if there's a matching caption that has been loaded, and renders it.

### File Structure

````
|-- public/                    Content scripts & background page
    |-- content-scripts/
       |-- amazon/             Amazon adapter
       |-- init/               Initialization scripts
          |-- adapter.js       Adapter  - knows what the DOM for this video site looks like
          |-- observer.js      Observer - watches DOM for new captions
          |-- provider.js      Provider - provides translations to Observer
       |-- netflix/            Netflix adapter, subtitle processor, and subtitle parser
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
