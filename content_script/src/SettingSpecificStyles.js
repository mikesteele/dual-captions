import React from 'react';

class FixedCaptionStyles extends React.Component {
  componentWillUnmount() {
    const { adapter } = this.props;
    if (adapter.captionWindow) {
      adapter.captionWindow.classList.remove('dc-modified');
    }
  }

  render() {
    const { adapter } = this.props;
    if (adapter.captionWindow) {
      adapter.captionWindow.classList.add('dc-modified');
    }
    return (
      <style>
      {`
        .player-timedtext-text-container {
          filter: opacity(0) !important;
        }

        .player-timedtext-text-container.dc-modified {
          filter: opacity(1) !important;
          position: fixed !important;
          bottom: 160px !important;
          left: 0px !important;
          width: 100% !important;
          text-align: center !important;
        }

        .ytp-caption-window-bottom {
          filter: opacity(0) !important;
        }

        .ytp-caption-window-bottom.dc-modified {
          filter: opacity(1) !important;
          position: fixed !important;
          top: 10px !important;
          left: 10px !important;
        }
      `}
      </style>
    );
  }
}

const SettingSpecificStyles = props => {
  const { settings, adapter } = props;
  if (settings.fixedCaptions) {
    return (
      <FixedCaptionStyles adapter={adapter} />
    );
  } else {
    return null;
  }
}

export default SettingSpecificStyles;
