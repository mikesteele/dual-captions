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
    provider,
    site,
    openSettingsModal
  } = props;
  return (
    <PopperOrFixedPosition adapter={adapter}>
      <div style={{
        padding: '8px',
        marginBottom: '160px'
      }}>
        <ViewBookmarksAction
          adapter={adapter}
          settings={settings}
          openViewBookmarksModal={openViewBookmarksModal}
          isOn={isOn}
        />
        <BookmarkAction
          adapter={adapter}
          settings={settings}
          currentCaptionToRender={currentCaptionToRender}
          isOn={isOn}
        />
        <ClipboardAction
          adapter={adapter}
          settings={settings}
          currentCaptionToRender={currentCaptionToRender}
          isOn={isOn}
        />
        <SettingsAction
          adapter={adapter}
          settings={settings}
          isOn={isOn}
          openSettingsModal={openSettingsModal}
        />
      </div>
    </PopperOrFixedPosition>
  );
}

export default Actions;
