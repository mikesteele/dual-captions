import React, { Fragment } from 'react';
import Captions from './Captions';
import Actions from './Actions';
import ViewBookmarksModal from './ViewBookmarksModal';
import LoadingTutorial from './LoadingTutorial';

class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoadingTutorial: false,
      viewBookmarksModalIsOpen: false
    }

    this.openViewBookmarksModal = this.openViewBookmarksModal.bind(this);
    this.onCloseViewBookmarksModal = this.onCloseViewBookmarksModal.bind(this);
    this.openLoadingTutorial = this.openLoadingTutorial.bind(this);
  }

  openLoadingTutorial() {
    this.setState({
      showLoadingTutorial: true
    });
  }

  closeLoadingTutorial() {
    this.setState({
      showLoadingTutorial: false
    });
  }

  openViewBookmarksModal() {
    this.setState({
      viewBookmarksModalIsOpen: true
    });
  }

  onCloseViewBookmarksModal() {
    this.setState({
      viewBookmarksModalIsOpen: false
    });
  }

  render() {
    const {
      adapter,
      settings,
      provider,
      isOn,
      videoId,
      site
    } = this.props;
    const {
      viewBookmarksModalIsOpen,
      showLoadingTutorial
    } = this.state;

    let currentCaptionToRender = '';
    if (adapter.providerInDebugMode) {
      currentCaptionToRender = 'In debug mode...';
    } else {
      currentCaptionToRender = provider.getCaptionToRender(adapter.playerCurrentTime, settings.secondSubtitleLanguage);
    }

    return (
      <Fragment>
        <Captions
          adapter={adapter}
          currentCaptionToRender={currentCaptionToRender}
          settings={settings}
          isOn={isOn}
          videoId={videoId}
        />
        <Actions
          adapter={adapter}
          currentCaptionToRender={currentCaptionToRender}
          settings={settings}
          openViewBookmarksModal={this.openViewBookmarksModal}
          isOn={isOn}
          videoId={videoId}
          provider={provider}
          site={site}
          openLoadingTutorial={this.openLoadingTutorial}
        />
        <ViewBookmarksModal
          adapter={adapter}
          currentCaptionToRender={currentCaptionToRender}
          isOpen={viewBookmarksModalIsOpen}
          onClose={this.onCloseViewBookmarksModal}
          settings={settings}
          isOn={isOn}
          videoId={videoId}
        />
        {showLoadingTutorial && (
          <LoadingTutorial adapter={adapter}/>
        )}
      </Fragment>
    )
  }
}

export default MainView;
