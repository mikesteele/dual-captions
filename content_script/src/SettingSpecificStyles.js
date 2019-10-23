import React from 'react';

class ApplySettingSpecificStyles extends React.Component {
  componentWillUnmount() {
    const { adapter } = this.props;
    if (adapter.captionWindowForFixedPosition) {
      adapter.captionWindowForFixedPosition.classList.remove('dc-modified');
    } else if (adapter.captionWindow) {
      adapter.captionWindow.classList.remove('dc-modified');
    }
  }

  render() {
    const { adapter, settings } = this.props;
    if (adapter.captionWindowForFixedPosition) {
      if (!adapter.captionWindowForFixedPosition.classList.contains('dc-modified')) {
        // Force layout
        let scrollWidth = adapter.captionWindowForFixedPosition.scrollWidth;
        adapter.captionWindowForFixedPosition.classList.add('dc-modified');
        scrollWidth = adapter.captionWindowForFixedPosition.scrollWidth;
      }
    } else if (adapter.captionWindow) {
      if (!adapter.captionWindow.classList.contains('dc-modified')) {
        // Force layout
        let scrollWidth = adapter.captionWindow.scrollWidth;
        adapter.captionWindow.classList.add('dc-modified');
        scrollWidth = adapter.captionWindow.scrollWidth;
      }
    }
    let rules = `
        filter: opacity(1) !important;
    `;
    if (settings.fixedCaptions) {
      rules = rules + adapter.firstCaptionsFixedPositionRules;
    }
    return (
      <style>
      {`
        ${adapter.captionWindowSelector} {
          filter: opacity(0) !important;
          transition: filter 200ms;
          transition-delay: 200ms;
        }

        ${adapter.captionWindowSelector}.dc-modified {
          ${rules}
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
      <ApplySettingSpecificStyles
        adapter={adapter}
        settings={settings}
      />
    );
  } else {
    return null;
  }
};

export default SettingSpecificStyles;
