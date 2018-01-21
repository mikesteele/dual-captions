const youtubePlayer = document.getElementById('movie_player');
const youtubePlayerCaptionClass = 'captions-text';
const youtubePlayerCaptionContainerClass = 'caption-window';

let fromLanguage = 'auto';
let toLanguage = 'en';

let observer;

if (!youtubePlayer) {
  console.log('Could not find YouTube player on this page.');
} else {
  // Set up observer to watch for new caption elements to be added to DOM.
  if (typeof observer === 'undefined') {
    observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target.classList.contains(youtubePlayerCaptionClass) & mutation.addedNodes.length > 0) {
          const currentCaptionStyle = mutation.target.querySelector('span').style.cssText;
          const newlyAddedCaption = mutation.addedNodes[0];
          window.translate(newlyAddedCaption.textContent, {
            from: fromLanguage,
            to: toLanguage
          }).then(translation => {
            let translatedCaptionElement = document.createElement('span');
            translatedCaptionElement.classList.add(youtubePlayerCaptionClass);
            translatedCaptionElement.style.cssText = currentCaptionStyle;
            translatedCaptionElement.innerHTML = translation.text;
            if (document.getElementsByClassName(youtubePlayerCaptionContainerClass)) {
            //
            // It's possible that the response from Google Translate took too long
            // and the caption container has already been removed from the DOM.
            // If so, we shouldn't try adding the translation.
            //
              let captionWindowElement = document.getElementsByClassName(youtubePlayerCaptionContainerClass)[0];
              captionWindowElement.appendChild(document.createElement('br'));
              captionWindowElement.appendChild(translatedCaptionElement);
            }
          });
        }
      });
    });
    observer.observe(youtubePlayer, {
      childList: true,
      subtree: true
    });
  }
};

window.stopObserver = function() {
  if (observer) {
    observer.disconnect();
  }
}

window.startObserver = function() {
  if (observer) {
    observer.observe(youtubePlayer, {
      childList: true,
      subtree: true
    });
  }
}

window.setToLanguage = function(language) {
  toLanguage = language;
}

window.setFromLanguage = function(language) {
  fromLanguage = language;
}