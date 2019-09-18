import React, { Fragment } from 'react';
import ActionButton from './ActionButton';
import Modal from './Modal';
import MdBook from 'react-icons/lib/md/book';

class ViewBookmarksAction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <ActionButton
          onClick={this.props.openViewBookmarksModal}
          tooltipText='View all bookmarks'
          settings={this.props.settings}
          adapter={this.props.adapter}
          isOn={this.props.isOn}
          videoId={this.props.videoId}
        >
          <MdBook />
        </ActionButton>
      </Fragment>
    )
  }
}

export default ViewBookmarksAction;
