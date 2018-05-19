## dual-captions <br/> Show captions in 2 languages on YouTube and Netflix 💬

![screenshot](https://github.com/mikesteele/dual-captions-gifs/raw/master/screenshot.gif)
<br/>
### <a href="https://www.youtube.com/watch?v=E0QQoeUAIpE" target="_blank">Watch video demo</a>
### Fast Facts

* Targeted at **language learners** who need what the speaker is saying and the translation in user's native language.
* 100+ languages supported. 🌎
* Uses Google Translate to translate captions into target language.
* Free! No API key required.

### Intro

As someone learning a foreign language, it is helpful for me to see both what the speaker is saying and the translation. 

As of March 2018, YouTube and Netflix can only show captions in one language. 

This Chrome Extension creates a MutationObserver which waits for new caption elements to be added to the DOM. It then translates the text of these captions and adds the translated captions underneath.

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

### License

MIT
