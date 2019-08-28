const DefaultCaptionStyle = {
  color: 'white',
  fontFamily: '"Netflix Sans", "Helvetica Nueue", Helvetica, Arial, sans-serif',
  fontSize: '33px',
  fontWeight: 'bolder',
  textShadow: 'rgb(0, 0, 0) 0px 0px 7px'
};

export const NetflixAdapterCreator = () => {
  let canRenderInCaptionWindow = false;
  let captionStyle = null;
  let captionWindow = null;
  let captionWindowPosition = null;
  let captionWindowStyle = { textAlign: 'center', width: '700px' };
  let video = document.querySelector('video') || null;
  let fullscreenRoot = document.querySelector('.nfp.AkiraPlayer');
  const defaultCaptionStyle = DefaultCaptionStyle;
  let smallTextSize = '22px';

  let isRenderingImageSubtitles = !!document.querySelector('.image-based-timed-text image');

  if (isRenderingImageSubtitles) {
    canRenderInCaptionWindow = false;
    captionWindow = document.querySelector('.image-based-timed-text image') || null;
    captionWindowPosition = captionWindow ? JSON.stringify({
      x: captionWindow.getAttribute('x'),
      y: captionWindow.getAttribute('y')
    }) : null;
  } else {
    captionWindow = document.querySelector('.player-timedtext-text-container') || null;
    if (captionWindow && captionWindow.children.length === 0) {
      console.log('here');
      captionWindow = null;
    }
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
    }
  }

  return {
    canRenderInCaptionWindow,
    captionWindow,
    captionWindowPosition,
    captionWindowStyle,
    captionStyle,
    defaultCaptionStyle,
    fullscreenRoot,
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
