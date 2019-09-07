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
    openViewBookmarksModal
  } = props;
  const shouldShow = settings.mouseIsActive && settings.isOn;
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
        />
        <BookmarkAction
          adapter={adapter}
          settings={settings}
          currentCaptionToRender={currentCaptionToRender}
        />
        <ClipboardAction
          adapter={adapter}
          settings={settings}
          currentCaptionToRender={currentCaptionToRender}
        />
      </div>
    </StickyPopper>
  );
}

export default Actions;
