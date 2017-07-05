/* Settings */

// YouTube
var youtubePlayer = document.getElementById('player-api');
var youtubePlayerCaptionClass = 'captions-text';
var youtubePlayerCaptionContainerClass = 'caption-window';

// Google Translate 
var GOOGLE_TRANSLATE_API_KEY = ''; // Add your Google Translate API key
var googleTranslateUrl = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
var secondSubtitleLanguage = 'en';

/* --- */

if (!youtubePlayer) {
  console.log('Could not find YouTube player on this page.');
} else if (!GOOGLE_TRANSLATE_API_KEY) {
  console.log('Google Translate API key required.')
} else {
  // Set up observer to watch for new caption elements to be added to DOM.
  var observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.target.classList.contains(youtubePlayerCaptionClass) & mutation.addedNodes.length > 0) {
        var currentCaptionStyle = mutation.target.querySelector('span').style.cssText;
        var newlyAddedCaption = mutation.addedNodes[0];
        translate(newlyAddedCaption.textContent, translation => {
          var translatedCaptionElement = document.createElement('span');
          translatedCaptionElement.classList.add(youtubePlayerCaptionClass);
          translatedCaptionElement.style.cssText = currentCaptionStyle;
          translatedCaptionElement.innerHTML = translation;
          if (document.getElementsByClassName(youtubePlayerCaptionContainerClass)) { 
            // 
            // It's possible that the response from Google Translate took too long 
            // and the caption container has already been removed from the DOM.
            // If so, we shouldn't try adding the translation.
            //
            var captionWindowElement = document.getElementsByClassName(youtubePlayerCaptionContainerClass)[0];
            captionWindowElement.appendChild(document.createElement('br'));
            captionWindowElement.appendChild(translatedCaptionElement);
          };
        });
      };
    });
  });
  observer.observe(youtubePlayer, {
    childList: true,
    subtree: true
  });
};

var translate = (textToTranslate, callback) => {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', googleTranslateUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    'q': textToTranslate,
    'target': secondSubtitleLanguage
  }));
  xhr.onreadystatechange = function() {
    if (this.readyState != 4) return;
    if (xhr.status === 200) {
      var response = JSON.parse(this.responseText);
      callback(response.data.translations[0]['translatedText']);
    }
  }
}