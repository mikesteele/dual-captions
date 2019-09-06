import React, { Fragment } from 'react';
import Captions from './Captions';
import Actions from './Actions';
import ViewFlagsModal from './ViewFlagsModal';

class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewFlagsModalIsOpen: false
    }

    this.openViewFlagsModal = this.openViewFlagsModal.bind(this);
    this.onCloseViewFlagsModal = this.onCloseViewFlagsModal.bind(this);
  }

  openViewFlagsModal() {
    this.setState({
      viewFlagsModalIsOpen: true
    });
  }

  onCloseViewFlagsModal() {
    this.setState({
      viewFlagsModalIsOpen: false
    });
  }

  render() {
    const {
      adapter,
      settings,
      currentCaptionToRender
    } = this.props;
    const {
      viewFlagsModalIsOpen
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
          openViewFlagsModal={this.openViewFlagsModal}
        />
        <ViewFlagsModal
          isOpen={viewFlagsModalIsOpen}
          onClose={this.onCloseViewFlagsModal}
          settings={settings}
        />
      </Fragment>
    )
  }
}

export default MainView;
