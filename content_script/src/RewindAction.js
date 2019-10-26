import React, { Fragment } from 'react';
import HotKey from './HotKey';
import ErrorModal from './ErrorModal';

class RewindAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      errorModalIsOpen: false
    }
    this.rewindToLastCaption = this.rewindToLastCaption.bind(this);
  }

  rewindToLastCaption() {
    const { adapter, provider, settings, site } = this.props;
    if (site !== 'youtube') {
      // Only works on YouTube, because setting video.currentTime on the Netflix player throws an error.
      this.setState({
        errorMessage: 'TODO - t - Sorry, rewind only works on YouTube.',
        errorModalIsOpen: true
      });
    } else if (settings.secondSubtitleLanguage === 'none') {
      this.setState({
        errorMessage: 'TODO - t - Please turn on second subtitles.',
        errorModalIsOpen: true
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
    const { errorModalIsOpen, errorMessage } = this.state;
    return (
      <Fragment>
        <HotKey
          hotKeyCode={71}
          callback={this.rewindToLastCaption}
        />
        <ErrorModal
          isOpen={errorModalIsOpen}
          onClose={() => {
            this.setState({
              errorModalIsOpen: false
            });
          }}
          adapter={adapter}
        >
          {errorMessage}
        </ErrorModal>
      </Fragment>
    )
  }
}

export default RewindAction;
