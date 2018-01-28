## dual-captions <br/> YouTube add-on to show captions in 2 languages 💬

![screenshot](https://github.com/mikesteele/dual-captions/blob/master/screenshot.png)
<br/>
### <a href="https://www.youtube.com/watch?v=pIED1THCitI" target="_blank">Watch video demo</a>
### Fast Facts

* Targeted at **language learners** who need what the speaker is saying and the translation in user's native language.
* 100+ languages supported. 🌎
* Uses Google Translate to translate captions into target language.
* Free! No API key required.

### Intro

As someone learning a foreign language, it is helpful for me to see both what the speaker is saying and the translation. 

As of January 2018, YouTube can only show captions in one language. 

This Chrome Extension creates a MutationObserver which waits for new caption elements to be added to the DOM. It then translates the text of these captions and adds the translated captions underneath.

### Usage

Link to Google Chrome Store: https://chrome.google.com/webstore/detail/dual-captions/lpeonmjfimoijceaalocpgjjchocbiap

You can load the extension manually by enabling Developer Mode in chrome://extensions. See https://developer.chrome.com/extensions/getstarted#unpacked.

### Thanks!

* google-translate-token: https://github.com/matheuss/google-translate-token
* google-translate-api: https://github.com/matheuss/google-translate-api

### License

MIT
