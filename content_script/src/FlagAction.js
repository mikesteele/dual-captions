import React, { Fragment } from 'react';
import ActionButton from './ActionButton';
import Modal from './Modal';
import { MdBookmarkBorder, MdBookmark } from 'react-icons/md';
import HotKey from './HotKey';

class FlagAction extends React.Component {
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
      favorites,
      addToFavorites,
      removeFromFavorites
    } = settings;

    const firstCaptionText = adapter.captionText || '';
    const secondCaptionText = currentCaptionToRender || '';
    const isFavorited = favorites.some(pair => (
      pair[0] === firstCaptionText &&
      pair[1] === secondCaptionText
    ));

    let tooltipText = 'Bookmark caption';
    let onClick = () => {
      addToFavorites(firstCaptionText, secondCaptionText);
    };
    let icon = (
      <MdBookmarkBorder />
    );

    if (isFavorited) {
      tooltipText = 'Remove from bookmarks'
      onClick = () => {
        removeFromFavorites([[firstCaptionText, secondCaptionText]]);
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

export default FlagAction;
