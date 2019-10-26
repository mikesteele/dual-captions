import React, { Fragment } from 'react';
import Captions from './Captions';
import Actions from './Actions';
import ViewBookmarksModal from './ViewBookmarksModal';
import SettingsModal from './SettingsModal';
import ErrorModal from './ErrorModal';

class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsModalIsOpen: false,
      viewBookmarksModalIsOpen: false
    }

    this.openViewBookmarksModal = this.openViewBookmarksModal.bind(this);
    this.onCloseViewBookmarksModal = this.onCloseViewBookmarksModal.bind(this);
    this.closeSettingsModal = this.closeSettingsModal.bind(this);
    this.openSettingsModal = this.openSettingsModal.bind(this);
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

  openSettingsModal() {
    this.setState({
      settingsModalIsOpen: true
    });
  }

  closeSettingsModal() {
    this.setState({
      settingsModalIsOpen: false
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
      settingsModalIsOpen,
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
          openSettingsModal={this.openSettingsModal}
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
        <SettingsModal
          adapter={adapter}
          currentCaptionToRender={currentCaptionToRender}
          isOpen={settingsModalIsOpen}
          onClose={this.closeSettingsModal}
          openSettingsModal={settingsModalIsOpen}
          settings={settings}
          isOn={isOn}
          videoId={videoId}
          provider={provider}
          site={site}
        />
      </Fragment>
    )
  }
}

export default MainView;
