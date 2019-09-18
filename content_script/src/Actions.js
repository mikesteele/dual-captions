import React from 'react';
import { StickyPopper } from './Popper';
import ViewBookmarksAction from './ViewBookmarksAction';
import ClipboardAction from './ClipboardAction';
import BookmarkAction from './BookmarkAction';

const Actions = props => {
  const {
    adapter,
    settings,
    currentCaptionToRender,
    openViewBookmarksModal,
    isOn,
    videoId
  } = props;
  return (
    <StickyPopper
      target={adapter.playerControls}
      placement='top-start'
      updateInfrequently
    >
      <div style={{
        padding: '8px'
      }}>
        <ViewBookmarksAction
          adapter={adapter}
          settings={settings}
          openViewBookmarksModal={openViewBookmarksModal}
          isOn={isOn}
          videoId={videoId}
        />
        <BookmarkAction
          adapter={adapter}
          settings={settings}
          currentCaptionToRender={currentCaptionToRender}
          isOn={isOn}
          videoId={videoId}
        />
        <ClipboardAction
          adapter={adapter}
          settings={settings}
          currentCaptionToRender={currentCaptionToRender}
          isOn={isOn}
          videoId={videoId}
        />
      </div>
    </StickyPopper>
  );
}

export default Actions;
