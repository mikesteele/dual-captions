import React from 'react';

class Adapter extends React.Component {
  render() {
    const { awareness, site } = this.props;
    let playerCurrentTime = null;
    let canRenderInCaptionWindow = false;
    let captionClassName = null;
    let captionWindow = null;
    let captionWindowPosition = null;
    let captionWindowStyle = null;
    let captionStyle = null;
    let providerInDebugMode = false
    let time = null;
    let defaultCaptionStyle = null;
    const onPopupOpened = () => { console.log('TODO') };
    let fullscreenRoot = null;
    let error = null;
    let smallTextSize = null;
    let captionText = '';
    let playerControls = null;
    if (awareness) {
      const { video } = awareness;
      playerCurrentTime = video && video.currentTime;
      captionWindow = awareness.captionWindow;
      captionWindowPosition = awareness.captionWindowPosition;
      captionStyle = awareness.captionStyle;
      captionClassName = awareness.captionClassName; // TODO - Use null?
      captionWindowStyle = awareness.captionWindowStyle;
      canRenderInCaptionWindow = awareness.canRenderInCaptionWindow;
      providerInDebugMode = awareness.providerInDebugMode;
      time = awareness.time;
      providerInDebugMode = awareness.providerInDebugMode;
      defaultCaptionStyle = awareness.defaultCaptionStyle;
      error = awareness.error;
      fullscreenRoot = awareness.fullscreenRoot;
      smallTextSize = awareness.smallTextSize;
      captionText = awareness.captionText;
      playerControls = awareness.playerControls;
    }
    const adapter = {
      canRenderInCaptionWindow,
      captionClassName,
      captionStyle,
      captionText,
      captionWindow,
      captionWindowPosition,
      captionWindowStyle,
      defaultCaptionStyle,
      fullscreenRoot,
      playerCurrentTime,
      providerInDebugMode,
      onPopupOpened,
      playerControls,
      smallTextSize,
      time,
      providerInDebugMode,
      error
    };
    return this.props.children(adapter);
  }
}

export default Adapter;
