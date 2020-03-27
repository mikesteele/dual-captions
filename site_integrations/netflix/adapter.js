const DefaultCaptionStyle = {
  color: 'white',
  fontFamily: '"Netflix Sans", "Helvetica Nueue", Helvetica, Arial, sans-serif',
  fontSize: '33px',
  fontWeight: 'bolder',
  textShadow: 'rgb(0, 0, 0) 0px 0px 7px'
};

const getBlobOfImageCaptions = callback => {
  const captionWindow = document.querySelector('.image-based-timed-text image');
  if (captionWindow) {
    const width = Number(captionWindow.getAttribute('width'));
    const height = Number(captionWindow.getAttribute('height'));
    const canvas = document.createElement('canvas');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext('2d');
    ctx.drawImage(captionWindow, 0, 0);
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      callback(url);
    });
  }
}

const NetflixAdapter = () => {
  let canRenderInCaptionWindow = false;
  let captionStyle = null;
  let captionWindow = null;
  let captionWindowPosition = null;
  let captionWindowStyle = { textAlign: 'center', width: '700px' };
  let video = document.querySelector('video') || null;
  let fullscreenRoot = document.querySelector('.nfp.AkiraPlayer');
  const defaultCaptionStyle = DefaultCaptionStyle;
  let smallTextSize = '22px';
  let captionText = '';
  let playerControls = document.querySelector('.PlayerControlsNeo__bottom-controls');
  let playerCurrentTime = null;
  let getCaptionBlob = null;

  let isRenderingImageSubtitles = !!document.querySelector('.image-based-timed-text image');

  if (isRenderingImageSubtitles) {
    canRenderInCaptionWindow = false;
    captionWindow = document.querySelector('.image-based-timed-text image') || null;
    captionWindowPosition = captionWindow ? JSON.stringify({
      x: captionWindow.getAttribute('x'),
      y: captionWindow.getAttribute('y')
    }) : null;
    getCaptionBlob = getBlobOfImageCaptions;
  } else {
    captionWindow = document.querySelector('.player-timedtext-text-container') || null;
    if (captionWindow) {
      captionWindowPosition = captionWindow.style.cssText;
      let caption = captionWindow.querySelector('span');
      if (caption) {
        captionStyle = {
          background: caption.style.background,
          backgroundColor: caption.style.backgroundColor,
          color: caption.style.color,
          fontFamily: caption.style.fontFamily,
          fontSize: caption.style.fontSize,
          fontWeight: caption.style.fontWeight,
          textShadow: caption.style.textShadow
        };
      }
      captionText = captionWindow.innerText;
    }
  }

  if (video) {
    playerCurrentTime = video.currentTime;
  }

  const actionPanelFixedPosition = {
    bottom: '160px',
    left: '16px'
  };

  const moveCaptionWindowSelectors = ['.image-based-timed-text image', '.player-timedtext-text-container'];
  // On Netflix, the image subtitle element is as big as the screen, so it needs to be moved by a pixel amount.
  const moveCaptionWindowRelative = isRenderingImageSubtitles ? false : true;

  return {
    actionPanelFixedPosition,
    canRenderInCaptionWindow,
    captionText,
    captionWindow,
    captionWindowPosition,
    captionWindowStyle,
    captionStyle,
    defaultCaptionStyle,
    fullscreenRoot,
    getCaptionBlob,
    moveCaptionWindowRelative,
    moveCaptionWindowSelectors,
    playerControls,
    playerCurrentTime,
    smallTextSize,
    video
  };
};

module.exports = NetflixAdapter;
