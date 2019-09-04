import React, { Fragment } from 'react';
import Modal from './Modal';
import Captions from './Captions';
import Actions from './Actions';

class ViewFlagsModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      isOpen,
      onClose
    } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <div>
          Hi
        </div>
      </Modal>
    )
  }
}

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
        />
      </Fragment>
    )
  }
}

export default MainView;
