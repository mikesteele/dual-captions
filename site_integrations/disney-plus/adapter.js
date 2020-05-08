const _get = require('lodash/get');

const DisneyPlusAdapter = () => {
  /**
   *  The Disney+ adapter uses a fixed position for its caption window.
   *  This is because the host captions are rendered via <video> textTracks
   *  and they don't move.
   */
  const captionWindow = null;
  const captionWindowFixedPosition = {
    bottom: 20,
    left: 0,
    position: 'fixed',
    width: '100%'
  }
  const captionWindowStyle = {
    width: '100%',
    fontSize: '24px',
    textAlign: 'center',
    color: 'white'
  }

  const video = document.querySelector('video');
  let playerCurrentTime = null;
  let captionText = '';
  if (video) {
    playerCurrentTime = video.currentTime;

    // Get the active cue text
    captionText = _get(video, 'textTracks[0].activeCues[0].text') || '';
  }

  // TODO - Need playerControls?
  const actionPanelFixedPosition = {
    bottom: '160px',
    left: '16px'
  };

  return {
    actionPanelFixedPosition,
    captionText,
    captionWindow,
    captionWindowFixedPosition,
    captionWindowStyle,
    playerCurrentTime,
    video
  };
};

module.exports = DisneyPlusAdapter;
