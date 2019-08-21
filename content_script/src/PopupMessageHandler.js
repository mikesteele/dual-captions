import React from 'react';

class PopupMessageHandler extends React.Component {
  constructor(props) {
    super(props);
    this.onMessage = this.onMessage.bind(this);

    // TODO - What should be default settings?
    // TODO - Need settingsAreDefault?
    this.state = {
      settings: {
        isOn: true, // TODO - Switch to false in final version
        extraSpace: false,
        secondSubtitleLanguage: 'en'
      }
    }

    this.changeSetting = this.changeSetting.bind(this);
  }

  componentDidMount() {
    if (global.chrome && global.chrome.runtime && global.chrome.runtime.onMessage) {
      global.chrome.runtime.onMessage.addListener(this.onMessage);
    }
  }

  componentWillUnmount() {
    if (global.chrome && global.chrome.runtime && global.chrome.runtime.onMessage) {
      global.chrome.runtime.onMessage.removeListener(this.onMessage); // TODO - Untested
    }
  }

  changeSetting(setting, value) {
    this.setState(state => ({
      settings: {
        ...state.settings,
        [setting]: value
      }
    }));
  }

  onMessage(message, sender, sendResponse) {
    if (!message.type) return;
    switch (message.type) {

      // TODO - Should deprecate
      case 'change-language':
      this.changeSetting('secondSubtitleLanguage', message.payload);
      break;

      case 'change-settings':
      const { extraSpace } = message.payload;
      if (this.state.settings.extraSpace !== extraSpace) {
        this.changeSetting('extraSpace', extraSpace);
      }
      break;

      case 'detect-site':
      sendResponse({
        ok: true,
        site: this.props.adapter.site
      });
      break;

      // TODO - Should deprecate
      case 'get-language':
      sendResponse({
        ok: true,
        secondLanguage: this.state.settings.secondSubtitleLanguage
      })
      break;

      case 'get-state':
      sendResponse({
        ok: true,
        settingsAreDefault: true, // TODO
        isOn: this.state.settings.isOn,
        secondLanguage: this.state.settings.secondLanguage, // TODO
        settings: {
          extraSpace: true, // TODO
          useCaptionsFromVideo: true, // TODO - Deprecate this setting
          delayRenderingUntilTranslation: true // TODO - Deprecate this setting
        },
        loadedLanguages: [] // TODO - Pass provider, then use this.props.provider.loadedLanguages
      });
      break;

      // TODO - Should deprecate
      case 'is-on':
      sendResponse({
        ok: true,
        isOn: this.state.settings.isOn
      });
      break;

      case 'start-observer':
      // TODO - Rename this message.type to 'turn-on'
      // TODO - If this.props.adapter.error ...
      this.changeSetting('isOn', true);
      sendResponse({
        ok: true
      });
      break;

      case 'stop-observer':
      // TODO - Rename this message.type to 'turn-off'
      this.changeSetting('isOn', false);
      sendResponse({
        ok: true
      });
      break;

      default:
      break;
    }
  }

  render() {
    const settings = this.state.settings;
    return this.props.children(settings);
  }
}

export default PopupMessageHandler;
