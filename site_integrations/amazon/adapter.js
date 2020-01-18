const AmazonAdapter = () => {
  const playerControls = document.querySelector('.bottomPanel');
  const captionWindow = document.querySelector('.persistentPanel span');
  const fullscreenRoot = document.querySelector('.cascadesContainer');
  const video = document.querySelector('video');
  const playerCurrentTime = video ? video.currentTime : null;
  const smallTextSize = '12px';

  return {
    captionWindow,
    fullscreenRoot,
    playerControls,
    smallTextSize,
    video,
    playerCurrentTime
  };
};

module.exports = AmazonAdapter;
