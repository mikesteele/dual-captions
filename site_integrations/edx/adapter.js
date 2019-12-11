const EdxAdapter = () => {
  const captionStyle = {};

  let captionWindow = null;
  // Edx allows user to follow along with captions in the sidebar or captions in a video.
  const captionsInVideo = document.querySelector('.closed-captions.is-visible');
  if (captionsInVideo) {
    // If user toggled captions on in video, let's render them there.
    captionWindow = document.querySelector('.closed-captions.is-visible');
  } else {
    // If not, we'll render the second captions in the sidebar.
    captionWindow = document.querySelector('li.current');
  }
  const captionText = captionWindow ? captionWindow.textContent : '';

  const fullscreenRoot = null;
  const playerControls = document.querySelector('.video-controls');
  const video = document.querySelector('video');
  const playerCurrentTime = video ? video.currentTime : null;
  const smallTextSize = '12px';

  return {
    captionStyle,
    captionText,
    captionWindow,
    fullscreenRoot,
    playerControls,
    playerCurrentTime,
    smallTextSize,
    video
  }
}

module.exports = EdxAdapter;
