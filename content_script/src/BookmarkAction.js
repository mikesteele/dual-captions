import React, { Fragment } from 'react';
import ActionButton from './ActionButton';
import Modal from './Modal';
import { MdBookmarkBorder, MdBookmark } from 'react-icons/md';
import HotKey from './HotKey';

class BookmarkAction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      settings,
      adapter,
      currentCaptionToRender
    } = this.props;
    const {
      bookmarks,
      addToBookmarks,
      removeFromBookmarks
    } = settings;

    const firstCaptionText = adapter.captionText || '';
    const secondCaptionText = currentCaptionToRender || '';
    const isBookmarked = bookmarks.some(pair => (
      pair[0] === firstCaptionText &&
      pair[1] === secondCaptionText
    ));

    let tooltipText = 'Bookmark caption';
    let onClick = () => {
      addToBookmarks(firstCaptionText, secondCaptionText);
    };
    let icon = (
      <MdBookmarkBorder />
    );

    if (isBookmarked) {
      tooltipText = 'Remove from bookmarks'
      onClick = () => {
        removeFromBookmarks([[firstCaptionText, secondCaptionText]]);
      }
      icon = (
        <MdBookmark />
      );
    }

    return (
      <Fragment>
        <ActionButton
          onClick={onClick}
          tooltipText={tooltipText}
          settings={settings}
          adapter={adapter}
          hotKeyCode={65} // A
        >
          { icon }
        </ActionButton>
      </Fragment>
    );
  }
}

export default BookmarkAction;
