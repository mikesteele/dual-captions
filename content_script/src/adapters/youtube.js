export const YoutubeAdapterCreator = () => {
  let caption;
  let captionWindow;
  let video;
  let error = null;
  video = document.querySelector('video');
  captionWindow = document.querySelector('.ytp-caption-window-bottom') || document.querySelector('.caption-window');
  caption = document.querySelector('.ytp-caption-segment');

  const automaticCaptions = document.querySelector('.ytp-caption-window-rollup');
  if (automaticCaptions) {
    // Automatic captions (.ytp-caption-window-rollup) aren't supported.
    error = 'automatic-subtitles';
  };

  return {
    canRenderInCaptionWindow: false,
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
  };
}

const YoutubeAdapter = {
  root: document.body,
  uniqueSelector: '#movie_player',
  value: YoutubeAdapterCreator
}

export default YoutubeAdapter;
