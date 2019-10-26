import React, { Fragment } from 'react';
import HotKey from './HotKey';
import Modal from './Modal';

class RewindAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    }
    this.rewindToLastCaption = this.rewindToLastCaption.bind(this);
  }

  rewindToLastCaption() {
    const { adapter, provider, settings, site } = this.props;
    if (site !== 'youtube') {
      // Only works on YouTube, because setting video.currentTime on the Netflix player throws an error.
      this.setState({
        error: 'TODO - t - Sorry, rewind only works on YouTube.'
      });
    } else if (settings.secondSubtitleLanguage === 'none') {
      this.setState({
        error: 'TODO - t - Please turn on second subtitles.'
      });
    } else if (!adapter.playerCurrentTime || !adapter.video) {
      console.log(`Error - RewindAction - Can't rewind, no playerCurrentTime or no video`);
      // TODO - ?
    } else {
      const time = provider.getTimeForPreviousCaption(adapter.playerCurrentTime, settings.secondSubtitleLanguage);
      if (time) {
        adapter.video.currentTime = time;
      } else {
        console.log(`Error - RewindAction - Can't rewind, provider returned null for time`)
        // TODO - ?
      }
    }
  }

  render() {
    const { adapter } = this.props;
    const { error } = this.state;
    return (
      <Fragment>
        <HotKey
          hotKeyCode={71}
          callback={this.rewindToLastCaption}
        />
        <Modal
          title='TODO - t - Error'
          isOpen={error}
          onClose={() => {
            this.setState({
              error: null
            });
          }}
          withPortal={adapter.fullscreenRoot || document.body}>
          {error}
        </Modal>
      </Fragment>
    )
  }
}

export default RewindAction;
