import React from 'react';
import { StickyPopper } from './Popper';
import ViewFlagsAction from './ViewFlagsAction';
import ClipboardAction from './ClipboardAction';
import FlagAction from './FlagAction';

const Actions = props => {
  const {
    adapter,
    settings,
    currentCaptionToRender,
    openViewFlagsModal
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
        <ViewFlagsAction
          adapter={adapter}
          settings={settings}
          openViewFlagsModal={openViewFlagsModal}
        />
        <FlagAction
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
