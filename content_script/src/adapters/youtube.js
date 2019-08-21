export const YoutubeAdapterCreator = () => {
  let caption;
  let captionWindow;
  let video;
  video = document.querySelector('video');
  captionWindow = document.querySelector('.ytp-caption-window-bottom') || document.querySelector('.caption-window');
  caption = document.querySelector('.captions-text > span');
  return {
    canRenderInCaptionWindow: true,
    captionWindow: captionWindow ? captionWindow : null,
    captionWindowPosition: captionWindow ? captionWindow.style.cssText : null,
    captionWindowStyle: { textAlign: 'center', width: '700px' },
    captionStyle: caption ? {
      background: caption.style.background,
      backgroundColor: caption.style.backgroundColor,
      color: caption.style.color,
      fontFamily: caption.style.fontFamily,
      fontSize: caption.style.fontSize
    } : null,
    captionClassName: 'captions-text',
    video: video ? video : null
  };
}

const YoutubeAdapter = {
  root: document.body,
  uniqueSelector: '#movie_player',
  value: YoutubeAdapterCreator
}

export default YoutubeAdapter;
