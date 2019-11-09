import React from 'react';

class ApplySettingSpecificStyles extends React.Component {
  componentWillUnmount() {
    const { adapter } = this.props;
    if (adapter.captionWindow) {
      adapter.captionWindow.classList.remove('dc-modified');
    }
  }

  render() {
    const { adapter, settings } = this.props;
    if (adapter.captionWindow) {
      if (!adapter.captionWindow.classList.contains('dc-modified')) {
        adapter.captionWindow.classList.add('dc-modified');
        // Force layout
        const scrollWidth = adapter.captionWindow.scrollWidth;
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
  const fixedCaptionsEnabled = settings.fixedCaptions && adapter.secondCaptionsFixedPosition && adapter.firstCaptionsFixedPositionRules;
  if (fixedCaptionsEnabled) {
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
