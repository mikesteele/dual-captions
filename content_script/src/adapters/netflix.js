const DefaultCaptionStyle = {
  color: 'white',
  fontFamily: '"Netflix Sans", "Helvetica Nueue", Helvetica, Arial, sans-serif',
  fontSize: '33px',
  fontWeight: 'bolder',
  textShadow: 'rgb(0, 0, 0) 0px 0px 7px'
};

export const NetflixAdapterCreator = () => {
  let captionStyle = null;
  let captionWindow = null;
  let captionWindowStyle = { textAlign: 'center', width: '700px' };
  let video = document.querySelector('video') || null;
  let fullscreenRoot = document.querySelector('.nfp.AkiraPlayer');
  const defaultCaptionStyle = DefaultCaptionStyle;
  let smallTextSize = '22px';
  let captionText = '';
  let playerControls = document.querySelector('.PlayerControlsNeo__bottom-controls');
  let playerCurrentTime = null;
  let captionWindowSelector = '.player-timedtext-text-container';
  let firstCaptionsFixedPositionRules = null;
  let secondCaptionsFixedPosition = null;

  let isRenderingImageSubtitles = !!document.querySelector('.image-based-timed-text image');

  if (isRenderingImageSubtitles) {
    captionWindow = document.querySelector('.image-based-timed-text image');
  } else {
    firstCaptionsFixedPositionRules = `
      position: fixed !important;
      bottom: 200px !important;
      left: 0px !important;
      width: 100% !important;
      text-align: center !important;

      /* TODO - remove */
      background: red;
      color: blue;
    `;
    secondCaptionsFixedPosition = {
      position: 'fixed',
      bottom: '140px',
      left:  '0px',
      width: '100%',
      textAlign: 'center',
      color: 'green', // TODO - Remove
      background: 'purple' // TODO - Remove
    };
    captionWindow = document.querySelector('.player-timedtext-text-container') || null;
    if (captionWindow) {
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

  return {
    actionPanelFixedPosition,
    captionText,
    captionWindow,
    captionWindowSelector,
    captionWindowStyle,
    captionStyle,
    defaultCaptionStyle,
    firstCaptionsFixedPositionRules,
    fullscreenRoot,
    playerControls,
    playerCurrentTime,
    secondCaptionsFixedPosition,
    smallTextSize,
    video
  };
};

const NetflixAdapter = {
  root: document.body,
  uniqueSelector: '.nfp.AkiraPlayer',
  value: NetflixAdapterCreator
};

export default NetflixAdapter;
