import React, { Fragment } from 'react';
import ActionButton from './ActionButton';
import Modal from './Modal';
import { MdBookmarkBorder, MdBookmark } from 'react-icons/md';
import HotKey from './HotKey';
import translate from './utils/translate';

class BookmarkAction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      settings,
      adapter,
      currentCaptionToRender,
      isOn,
      videoId
    } = this.props;
    const {
      bookmarks,
      addToBookmarks,
      removeFromBookmarks
    } = settings;

    const t = (key) => translate(settings.uiLanguage, key);

    const firstCaptionText = adapter.captionText || '';
    const secondCaptionText = currentCaptionToRender || '';
    const isBookmarked = bookmarks.some(pair => (
      pair[0] === firstCaptionText &&
      pair[1] === secondCaptionText
    ));

    let tooltipText = t('bookmark-caption');
    let onClick = () => {
      if (adapter.getCaptionBlob) {
        adapter.getCaptionBlob(captionText => {
          addToBookmarks(captionText, secondCaptionText);
        });
      } else {
        addToBookmarks(firstCaptionText, secondCaptionText);
      }
    };
    let icon = (
      <MdBookmarkBorder />
    );

    if (isBookmarked) {
      tooltipText = t('remove-from-bookmarks');
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
          isOn={isOn}
          videoId={videoId}
        >
          { icon }
        </ActionButton>
      </Fragment>
    );
  }
}

export default BookmarkAction;
