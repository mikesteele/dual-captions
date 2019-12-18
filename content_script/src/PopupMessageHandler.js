import React from 'react';
import { getSavedStore } from './utils/chrome';

const D_KEY_CODE = 68;
const ALT_KEY_CODE = 18;

// From https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
const downloadStringAsFile = str => {
  const a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(new Blob([str], {type: 'text/plain;charset=utf-8;'}));
  a.download = 'subtitles.srt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

class PopupMessageHandler extends React.Component {
  constructor(props) {
    super(props);
    this.onMessage = this.onMessage.bind(this);

    this.state = {
      settings: {
        extraSpace: false,
        secondSubtitleLanguage: 'none',
        settingsAreDefault: true,
        customColorsEnabled: false,
        customTextColor: '#FFFFFF',
        smallText: false,
        hotKeyEnabled: true,
        mouseIsActive: false,
        uiLanguage: 'en',
        hideActionPanel: false
      },
      bookmarks: []
    }

    this.changeSetting = this.changeSetting.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.addToBookmarks = this.addToBookmarks.bind(this);
    this.removeFromBookmarks = this.removeFromBookmarks.bind(this);
    this.getSavedBookmarks = this.getSavedBookmarks.bind(this);
    this.setSavedBookmarks = this.setSavedBookmarks.bind(this);

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
    this.getSavedBookmarks().then(savedBookmarks => {
      this.setState({
        bookmarks: savedBookmarks
      });
    }).catch(err => {
      console.log(`Couldn't get saved bookmarks on mount. Error: ${err}`);
    });
    this.getSavedUILanguage().then(uiLanguage => {
      if (uiLanguage) {
        this.changeSetting('uiLanguage', uiLanguage);
      }
    }).catch(err => {
      console.log(`Couldn't get saved UI language on mount. Error: ${err}`);
    })
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
    }, 2500);
  }

  onKeyDown(e) {
    const {
      isOn,
      changeIsOn
    } = this.props;
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
      changeIsOn(!isOn);
    }
  }

  getSavedUILanguage() {
    return new Promise((resolve, reject) => {
      getSavedStore().then(store => {
        resolve(store.uiLanguage);
      }).catch(reject);
    });
  }

  getSavedBookmarks() {
    return new Promise((resolve, reject) => {
      window.chrome.storage.sync.get('__DC_bookmarks__', result => {
        if (result.__DC_bookmarks__) {
          resolve(result.__DC_bookmarks__);
        } else {
          console.log('No saved bookmarks');
          resolve([]);
        }
      });
    });
  }

  setSavedBookmarks(bookmarks) {
    return new Promise((resolve, _) => {
      window.chrome.storage.sync.set({
        __DC_bookmarks__: bookmarks
      }, () => {
        resolve();
      });
    });
  }

  addToBookmarks(text1, text2) {
    this.getSavedBookmarks().then(savedBookmarks => {
      const newBookmarks = [
        ...savedBookmarks,
        [text1, text2]
      ];
      this.setSavedBookmarks(newBookmarks).then(() => {
        this.getSavedBookmarks().then(bookmarks => {
          this.setState({
            bookmarks
          }, () => {
            console.log('Set bookmarks:' + JSON.stringify(bookmarks, 2, ' '));
          });
        });
      });
    }).catch(err => {
      console.error(`Couldn't save bookmarks. Error: ${err}`);
    });
  }

  // captionsToRemove is Array(Array(String))
  removeFromBookmarks(captionsToRemove) {
    this.getSavedBookmarks().then(savedBookmarks => {
      captionsToRemove.forEach(captions => {
        const [text1, text2] = captions;
        const index = savedBookmarks.findIndex(pair => {
          return pair[0] === text1 && pair[1] === text2;
        });
        if (index >= 0) {
          savedBookmarks.splice(index, 1);
        }
      });
      this.setSavedBookmarks(savedBookmarks).then(() => {
        this.getSavedBookmarks().then(bookmarks => {
          this.setState({
            bookmarks
          }, () => {
            console.log('Set bookmarks:' + JSON.stringify(bookmarks, 2, ' '));
          });
        });
      });
    }).catch(err => {
      console.error(`Couldn't save bookmarks. Error: ${err}`);
    });
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
    const {
      settings
    } = this.state;
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
        hotKeyEnabled,
        hideActionPanel
      } = message.payload;
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
      if (settings.hideActionPanel !== hideActionPanel) {
        this.changeSetting('hideActionPanel', hideActionPanel);
      }
      break;

      case 'detect-site':
      sendResponse({
        ok: true,
        site: this.props.site
      });
      break;

      // TODO - Should deprecate
      case 'get-language':
      sendResponse({
        ok: true,
        secondLanguage: this.state.settings.secondSubtitleLanguage
      })
      break;

      // TODO - Deprecate
      case "popup-opened":
      sendResponse({
        ok: true,
      });
      break;

      case 'get-state':
      const { provider, isOn } = this.props;
      sendResponse({
        ok: true,
        settingsAreDefault: settings.settingsAreDefault,
        isOn: isOn,
        secondLanguage: settings.secondSubtitleLanguage,
        settings: {
          extraSpace: settings.extraSpace,
          customColorsEnabled: settings.customColorsEnabled,
          customTextColor: settings.customTextColor,
          smallText: settings.smallText,
          hotKeyEnabled: settings.hotKeyEnabled,
          hideActionPanel: settings.hideActionPanel
        },
        loadedLanguages: provider.loadedLanguages,
      });
      break;

      case 'change-ui-language':
      this.changeSetting('uiLanguage', message.payload);
      sendResponse({
        ok: true
      });
      // TODO - Temporary - remove
      downloadStringAsFile('works!');
      break;

      default:
      break;
    }
  }

  render() {
    const settings = this.state.settings;
    return this.props.children({
      ...settings,
      bookmarks: this.state.bookmarks,
      addToBookmarks: this.addToBookmarks,
      removeFromBookmarks: this.removeFromBookmarks,
      changeSetting: this.changeSetting
    });
  }
}

export default PopupMessageHandler;
