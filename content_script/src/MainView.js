import React, { Fragment } from 'react';
import Captions from './Captions';
import Actions from './Actions';
import ViewBookmarksModal from './ViewBookmarksModal';


class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewBookmarksModalIsOpen: false
    }

    this.openViewBookmarksModal = this.openViewBookmarksModal.bind(this);
    this.onCloseViewBookmarksModal = this.onCloseViewBookmarksModal.bind(this);
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
      viewBookmarksModalIsOpen
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
      </Fragment>
    )
  }
}

export default MainView;
