const KanopyAdapter = () => {
  const playerControls = document.querySelector('.vjs-control-bar');
  const fullscreenRoot = document.getElementById('player');
  const captionWindow = document.querySelector('.vjs-text-track-display > div > div > div');
  const video = document.querySelector('video');

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

  return {
    captionStyle,
    captionWindow,
    fullscreenRoot,
    playerControls,
    playerCurrentTime,
    video
  };
};

module.exports = KanopyAdapter;
