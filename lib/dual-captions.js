var youtubePlayer = document.getElementById('movie_player');
var youtubePlayerCaptionClass = 'captions-text';
var youtubePlayerCaptionContainerClass = 'caption-window';


if (!youtubePlayer) {
  console.log('Could not find YouTube player on this page.');
} else {
  // Set up observer to watch for new caption elements to be added to DOM.
  if (typeof window.DUAL_CAPTIONS.observer === 'undefined') {
    window.DUAL_CAPTIONS.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target.classList.contains(youtubePlayerCaptionClass) & mutation.addedNodes.length > 0) {
          const currentCaptionStyle = mutation.target.querySelector('span').style.cssText;
          const newlyAddedCaption = mutation.addedNodes[0];
          if (newlyAddedCaption.textContent !== window.DUAL_CAPTIONS.lastCaption) {
            window.DUAL_CAPTIONS.lastCaption = newlyAddedCaption.textContent;
            // Prevent re-adding the same caption on window resizing
            window.DUAL_CAPTIONS.translate(newlyAddedCaption.textContent, {
              from: 'auto',
              to: window.DUAL_CAPTIONS.observerLanguage || 'en'
            }).then(translation => {
              var translatedCaptionElement = document.createElement('span');
              translatedCaptionElement.classList.add(youtubePlayerCaptionClass);
              translatedCaptionElement.style.cssText = currentCaptionStyle;
              translatedCaptionElement.innerHTML = translation.text;
              if (document.getElementsByClassName(youtubePlayerCaptionContainerClass)) {
              //
              // It's possible that the response from Google Translate took too long
              // and the caption container has already been removed from the DOM.
              // If so, we shouldn't try adding the translation.
              //
                var captionWindowElement = document.getElementsByClassName(youtubePlayerCaptionContainerClass)[0];
                var breakElement = document.createElement('br');
                if (window.DUAL_CAPTIONS.extraSpace) {
                  captionWindowElement.appendChild(breakElement.cloneNode());
                }
                captionWindowElement.appendChild(breakElement);
                captionWindowElement.appendChild(translatedCaptionElement);
              }
            });
          }
        }
      });
    });
    window.DUAL_CAPTIONS.observer.observe(youtubePlayer, {
      childList: true,
      subtree: true
    });
    window.DUAL_CAPTIONS.observerObserving = true;
  }
};

window.DUAL_CAPTIONS.stopObserver = function() {
  if (window.DUAL_CAPTIONS.observer) {
    window.DUAL_CAPTIONS.observer.disconnect();
    window.DUAL_CAPTIONS.observerObserving = false;
  }
}

window.DUAL_CAPTIONS.startObserver = function() {
  if (window.DUAL_CAPTIONS.observer) {
    window.DUAL_CAPTIONS.observer.observe(youtubePlayer, {
      childList: true,
      subtree: true
    });
    window.DUAL_CAPTIONS.observerObserving = true;
  }
}

window.DUAL_CAPTIONS.getObserverLanguage = function(language) {
  if (window.DUAL_CAPTIONS.observer && window.DUAL_CAPTIONS.observerLanguage) {
    return window.DUAL_CAPTIONS.observerLanguage;
  } else {
    return '';
  }
}

window.DUAL_CAPTIONS.setObserverLanguage = function(language) {
  if (window.DUAL_CAPTIONS.observer) {
    window.DUAL_CAPTIONS.observerLanguage = language;
  }
}

window.DUAL_CAPTIONS.setExtraSpace = function(value) {
  if (window.DUAL_CAPTIONS.observer) {
    window.DUAL_CAPTIONS.extraSpace = value;
  }
}