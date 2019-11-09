export const YoutubeAdapterCreator = () => {
  let caption;
  let captionWindow;
  let video;
  let error = null;
  video = document.querySelector('video');
  captionWindow = document.querySelector('.ytp-caption-window-bottom') || document.querySelector('.caption-window');
  caption = document.querySelector('.ytp-caption-segment');
  let smallTextSize = '14px';
  let captionText = captionWindow ? captionWindow.innerText : '';
  let playerControls = document.querySelector('.ytp-chrome-bottom');
  let playerCurrentTime = null;

  const automaticCaptions = document.querySelector('.ytp-caption-window-rollup');
  if (automaticCaptions) {
    // Automatic captions (.ytp-caption-window-rollup) aren't supported.
    error = 'automatic-subtitles';
  };

  if (video) {
    playerCurrentTime = video.currentTime;
  }

  // Fixed position for YouTube is not supported at this time
  const firstCaptionsFixedPositionRules = null;
  const secondCaptionsFixedPosition = null;

  return {
    captionWindow: captionWindow ? captionWindow : null,
    captionWindowPosition: captionWindow ? captionWindow.style.cssText : null,
    captionWindowStyle: {
      textAlign: 'center'
    },
    captionStyle: caption ? {
      background: 'black',
      color: 'white',
      fontFamily: caption.style.fontFamily,
      fontSize: caption.style.fontSize,
      padding: '4px',
    } : null,
    captionClassName: 'captions-text',
    video: video ? video : null,
    error: error,
    smallTextSize: smallTextSize,
    captionText: captionText,
    playerControls: playerControls,
    playerCurrentTime: playerCurrentTime,
    firstCaptionsFixedPositionRules,
    secondCaptionsFixedPosition
  };
}

const YoutubeAdapter = {
  root: document.body,
  uniqueSelector: '#movie_player',
  value: YoutubeAdapterCreator
}

export default YoutubeAdapter;
