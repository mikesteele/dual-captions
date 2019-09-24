import React from 'react';
import { StickyPopper } from './Popper';
import ViewBookmarksAction from './ViewBookmarksAction';
import ClipboardAction from './ClipboardAction';
import BookmarkAction from './BookmarkAction';
import SettingControls from './SettingControls';

const Actions = props => {
  const {
    adapter,
    settings,
    currentCaptionToRender,
    openViewBookmarksModal,
    isOn,
    videoId,
    provider,
    site
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
        <SettingControls
          adapter={adapter}
          currentCaptionToRender={currentCaptionToRender}
          settings={settings}
          isOn={isOn}
          videoId={videoId}
          provider={provider}
          site={site}
        />
      </div>
    </StickyPopper>
  );
}

export default Actions;
