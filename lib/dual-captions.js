var youtubePlayer = document.getElementById('movie_player');
var youtubePlayerCaptionClass = 'captions-text';
var youtubePlayerCaptionContainerClass = 'caption-window';

if (!youtubePlayer) {
  console.log('Could not find YouTube player on this page.');
} else {
  // Set up observer to watch for new caption elements to be added to DOM.
  if (typeof window.observer === 'undefined') {
    window.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target.classList.contains(youtubePlayerCaptionClass) & mutation.addedNodes.length > 0) {
          const currentCaptionStyle = mutation.target.querySelector('span').style.cssText;
          const newlyAddedCaption = mutation.addedNodes[0];
          if (newlyAddedCaption.textContent !== window.lastCaption) {
            window.lastCaption = newlyAddedCaption.textContent;
            // Prevent re-adding the same caption on window resizing
            window.translate(newlyAddedCaption.textContent, {
              from: 'auto',
              to: window.observerLanguage || 'en'
            }).then(translation => {
              console.log(window.observerLanguage);
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
                captionWindowElement.appendChild(document.createElement('br'));
                captionWindowElement.appendChild(translatedCaptionElement);
              }
            });
          }
        }
      });
    });
    window.observer.observe(youtubePlayer, {
      childList: true,
      subtree: true
    });
    window.observerObserving = true;
  }
};

window.stopObserver = function() {
  if (window.observer) {
    window.observer.disconnect();
    window.observerObserving = false;
  }
}

window.startObserver = function() {
  if (window.observer) {
    window.observer.observe(youtubePlayer, {
      childList: true,
      subtree: true
    });
    window.observerObserving = true;
  }
}

window.getObserverLanguage = function(language) {
  if (window.observer && window.observerLanguage) {
    return window.observerLanguage;
  } else {
    return '';
  }
}

window.setObserverLanguage = function(language) {
  if (window.observer) {
    window.observerLanguage = language;
  }
}