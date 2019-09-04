import React, { Fragment } from 'react';
import ActionButton from './ActionButton';
import Modal from './Modal';
import { MdBook } from 'react-icons/md';

class ViewFlagsAction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <ActionButton
          onClick={this.props.openViewFlagsModal}
          tooltipText='View all flags'
          settings={this.props.settings}
          adapter={this.props.adapter}
        >
          <MdBook />
        </ActionButton>
      </Fragment>
    )
  }
}

export default ViewFlagsAction;
