import React from 'react';

const D_KEY_CODE = 68;
const ALT_KEY_CODE = 18;

class PopupMessageHandler extends React.Component {
  constructor(props) {
    super(props);
    this.onMessage = this.onMessage.bind(this);

    this.state = {
      settings: {
        isOn: false,
        extraSpace: false,
        secondSubtitleLanguage: 'none',
        settingsAreDefault: true,
        customColorsEnabled: false,
        customTextColor: '#FFFFFF',
        smallText: false,
        hotKeyEnabled: true,
        mouseIsActive: false
      }
    }

    this.changeSetting = this.changeSetting.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.altKeyPressed = false;
    this.dKeyPressed = false;
    this.idleTimer = null;
  }

  componentDidMount() {
    if (global.chrome && global.chrome.runtime && global.chrome.runtime.onMessage) {
      global.chrome.runtime.onMessage.addListener(this.onMessage);
    }
    document.body.addEventListener('keydown', this.onKeyDown);
    document.body.addEventListener('keyup', this.onKeyUp);
    document.body.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove() {
    if (!this.state.settings.mouseIsActive) {
      this.changeSetting('mouseIsActive', true);
    }
    if (this.idleTimer) {
      window.clearTimeout(this.idleTimer);
    }
    this.idleTimer = window.setTimeout(() => {
      this.changeSetting('mouseIsActive', false);
    }, (3 * 1000) + 500);
  }

  onKeyDown(e) {
    const {
      settings
    } = this.state;
    if (e.keyCode === D_KEY_CODE) {
      this.dKeyPressed = true;
    }
    if (e.keyCode === ALT_KEY_CODE) {
      this.altKeyPressed = true;
    }
    if (this.dKeyPressed && this.altKeyPressed && settings.hotKeyEnabled) {
      this.changeSetting('isOn', !settings.isOn);
    }
  }

  onKeyUp(e) {
    if (e.keyCode === D_KEY_CODE) {
      this.dKeyPressed = false;
    }
    if (e.keyCode === ALT_KEY_CODE) {
      this.altKeyPressed = false;
    }
  }

  componentWillUnmount() {
    if (global.chrome && global.chrome.runtime && global.chrome.runtime.onMessage) {
      global.chrome.runtime.onMessage.removeListener(this.onMessage); // TODO - Untested
    }
    document.body.removeEventListener('keydown', this.onKeyDown);
    document.body.removeEventListener('keyup', this.onKeyUp);
  }

  changeSetting(setting, value) {
    this.setState(state => ({
      settings: {
        ...state.settings,
        [setting]: value,
        settingsAreDefault: false,
      },
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
      const {
        extraSpace,
        customTextColor,
        customColorsEnabled,
        smallText,
        hotKeyEnabled
      } = message.payload;

      const {
        settings
      } = this.state;
      if (settings.extraSpace !== extraSpace) {
        this.changeSetting('extraSpace', extraSpace);
      }
      if (settings.customTextColor !== customTextColor) {
        this.changeSetting('customTextColor', customTextColor);
      }
      if (settings.customColorsEnabled !== customColorsEnabled) {
        this.changeSetting('customColorsEnabled', customColorsEnabled);
      }
      if (settings.smallText !== smallText) {
        this.changeSetting('smallText', smallText);
      }
      if (settings.hotKeyEnabled !== hotKeyEnabled) {
        this.changeSetting('hotKeyEnabled', hotKeyEnabled);
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

      case "popup-opened":
      const { adapter } = this.props;
      if (adapter.error) {
        sendResponse({
          ok: false,
          errorType: adapter.error,
        });
      } else {
        sendResponse({
          ok: true,
        });
      }
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
