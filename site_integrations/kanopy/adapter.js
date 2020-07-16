const KanopyAdapter = () => {
  const playerControls = document.querySelector('.vjs-control-bar');
  const fullscreenRoot = document.getElementById('player');
  const captionWindow = document.querySelector('.vjs-text-track-display > div > div > div');
  const video = document.querySelector('video');
  const captionText = captionWindow ? captionWindow.textContent : '';


  const isFullscreen = document.fullscreenElement && fullscreenRoot && document.fullscreenElement === fullscreenRoot;
  const smallTextSize = isFullscreen ? '18px' : '12px';

  let playerCurrentTime = null;
  if (video) {
    playerCurrentTime = video.currentTime;
  }

  let captionStyle = null;
  const captionWindowParent = document.querySelector('.vjs-text-track-display > div > div');
  if (captionWindowParent && captionWindow) {
    captionStyle = {
      font: captionWindowParent.style.font,
      backgroundColor: captionWindow.style.backgroundColor,
      color: captionWindow.style.color
    };
  }

  const moveCaptionWindowSelectors = ['.vjs-text-track-display > div > div > div'];
  const moveCaptionWindowAdditionalRules = ['display: inline-block !important;'];
  const moveCaptionWindowRelative = true;

  return {
    captionText,
    captionStyle,
    captionWindow,
    fullscreenRoot,
    moveCaptionWindowAdditionalRules,
    moveCaptionWindowRelative,
    moveCaptionWindowSelectors,
    playerControls,
    playerCurrentTime,
    smallTextSize,
    video
  };
};

module.exports = KanopyAdapter;
