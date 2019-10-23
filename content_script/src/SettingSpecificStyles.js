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
      adapter.captionWindow.classList.add('dc-modified');
    }
    let rules = `
        filter: opacity(1) !important;
    `;
    if (settings.fixedCaptions) {
      rules = rules + `
        position: fixed !important;
        bottom: 160px !important;
        left: 0px !important;
        width: 100% !important;
        text-align: center !important;
      `;
    }
    return (
      <style>
      {`
        ${adapter.captionWindowSelector} {
          filter: opacity(0) !important;
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
