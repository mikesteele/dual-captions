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
      currentCaptionToRender
    } = this.props;
    const {
      viewBookmarksModalIsOpen
    } = this.state;
    return (
      <Fragment>
        <Captions
          adapter={adapter}
          currentCaptionToRender={currentCaptionToRender}
          settings={settings}
        />
        <Actions
          adapter={adapter}
          currentCaptionToRender={currentCaptionToRender}
          settings={settings}
          openViewBookmarksModal={this.openViewBookmarksModal}
        />
        <ViewBookmarksModal
          adapter={adapter}
          currentCaptionToRender={currentCaptionToRender}
          isOpen={viewBookmarksModalIsOpen}
          onClose={this.onCloseViewBookmarksModal}
          settings={settings}
        />
      </Fragment>
    )
  }
}

export default MainView;
