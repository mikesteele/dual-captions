import React from 'react';
import { StickyPopper } from './Popper';
import ViewBookmarksAction from './ViewBookmarksAction';
import ClipboardAction from './ClipboardAction';
import BookmarkAction from './BookmarkAction';
import SettingsAction from './SettingsAction';

const PopperOrFixedPosition = props => {
  const {
    adapter,
    children
  } = props;
  if (adapter.actionPanelFixedPosition) {
    return (
      <div style={{
        position: 'fixed',
        zIndex: '10000',
        ...adapter.actionPanelFixedPosition
      }}>
        {children}
      </div>
    )
  } else {
    return (
      <StickyPopper
        target={adapter.playerControls}
        placement='top-start'
        updateInfrequently
      >
        {children}
      </StickyPopper>
    );
  }
}

const Actions = props => {
  const {
    adapter,
    settings,
    currentCaptionToRender,
    openViewBookmarksModal,
    isOn,
    videoId,
    provider,
    site,
    openSettingsModal
  } = props;
  return (
    <PopperOrFixedPosition adapter={adapter}>
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
        <SettingsAction
          adapter={adapter}
          settings={settings}
          isOn={isOn}
          videoId={videoId}
          openSettingsModal={openSettingsModal}
        />
      </div>
    </PopperOrFixedPosition>
  );
}

export default Actions;
