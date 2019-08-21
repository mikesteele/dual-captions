import React from 'react';
import { iso639_3to1 } from './utils/i18n';
const franc = require('franc');

class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      captions: {},
      translations: {}
    }
    this.onMessage = this.onMessage.bind(this);
    this.canUseCaptionsFromVideo = this.canUseCaptionsFromVideo.bind(this);
    this.guessLanguage = this.guessLanguage.bind(this);
    this.guessLanguageOfCaptions = this.guessLanguageOfCaptions.bind(this);
    this.getLoadedLanguages = this.getLoadedLanguages.bind(this);
  }

  componentDidMount() {
    if (global.chrome && global.chrome.runtime && global.chrome.runtime.onMessage) {
      global.chrome.runtime.onMessage.addListener(this.onMessage);
      global.setInterval(() => {
        global.chrome.runtime.sendMessage({
          type: 'get-pending-messages'
        }, () => {});
      }, 1000);
    }
  }

  canUseCaptionsFromVideo() {
    const currentSite = this.props.adapter.site;
    const videoId = this.props.adapter.videoId;
    const secondSubtitleLanguage = this.props.settings.secondSubtitleLanguage;
    if (this.state.captions
      && this.state.captions[currentSite]
      && this.state.captions[currentSite][videoId]
      && this.state.captions[currentSite][videoId][secondSubtitleLanguage]) {
      return true;
    } else {
      return false;
    }
  }

  getCaptionToRender() {
    const currentSite = this.props.adapter.site;
    const videoId = this.props.adapter.videoId;
    const secondSubtitleLanguage = this.props.settings.secondSubtitleLanguage;
    const currentTime = this.props.adapter.playerCurrentTime;
    const captions = this.state.captions[currentSite][videoId][secondSubtitleLanguage];
    let captionToRender = captions.find(caption => {
      return caption.startTime < currentTime && currentTime < caption.endTime;
    });
    if (captionToRender) {
      return captionToRender.text;
    } else {
      return '';
    }
  }

  getLoadedLanguages() {
    const currentSite = this.props.adapter.site;
    const videoId = this.props.adapter.videoId;
    if (currentSite
        && videoId
        && this.state.captions.hasOwnProperty(currentSite)
        && this.state.captions[currentSite].hasOwnProperty(videoId)) {
      return Object.keys(this.state.captions[currentSite][videoId]);
    } else {
      return [];
    }
  }

  guessLanguageOfCaptions(captions) {
    return new Promise((resolve, reject) => {
      const allText = captions.reduce((sum, currentCaption) => currentCaption.text + ' ' + sum, '');
      this.guessLanguage(allText)
         .then(language => {
           resolve({
             captions: captions,
             language: language
           });
         })
         .catch(reject);
    });
  }

  guessLanguage(text) {
    return new Promise((resolve, reject) => {
      const result = franc(text);
      if (result) {
        const isoCode = iso639_3to1[result];
        if (isoCode) {
          resolve(isoCode);
        } else {
          reject(`Could not convert franc result. Result: ${result}`);
        }
      } else {
        reject(`Could not detect language. Text: ${text}`);
      }
    });
  }

  loadCaptions(captions, language) {
    // TODO - Don't allow loading captions if null videoId
    return new Promise((resolve, reject) => {
      const currentSite = this.props.adapter.site;
      const videoId = this.props.adapter.videoId;
      this.setState(state => {
        let nextState = {...state};
        if (state.captions[currentSite] && state.captions[currentSite][videoId]) {
          // TODO - Bail out if already loaded this language
          nextState.captions[currentSite][videoId][language] = captions;
        } else if (state.captions[currentSite]) {
          nextState.captions[currentSite][videoId] = {};
          nextState.captions[currentSite][videoId][language] = captions;
        } else {
          nextState.captions[currentSite] = {};
          nextState.captions[currentSite][videoId] = {};
          nextState.captions[currentSite][videoId][language] = captions;
        }
        return nextState;
      }, () => {
        resolve();
      });
    });
  }

  onMessage(message, sender, sendResponse) {
    if (!message.type) return;
    switch (message.type) {
      case 'process-caption-request':
      // TODO - Bail out if message.site doesn't match
      this.fetchUrl(message.payload)
        .then(captionFile => this.props.parser.parse(captionFile, this.props.adapter.site))
        .then(this.guessLanguageOfCaptions)
        .then(result => {
          const {captions, language} = result;
          return this.loadCaptions(captions, language);
        })
        .then(() => {
          console.log('Loaded.');
          console.log(this.state);
          sendResponse({
            ok: true
          });
        })
        .catch(err => {
          console.log(err);
          sendResponse({
            ok: false,
            error: err
          });
        });
      break;

      case 'get-state':
      const { settings } = this.props;
      const loadedLanguages = this.getLoadedLanguages();
      sendResponse({
        ok: true,
        settingsAreDefault: settings.settingsAreDefault,
        isOn: settings.isOn,
        secondLanguage: settings.secondSubtitleLanguage,
        settings: {
          extraSpace: settings.extraSpace,
        },
        loadedLanguages: loadedLanguages,
      });
      break;

      default:
      break;
    }
  }

  fetchUrl(url) {
    return new Promise((resolve, reject) => {
      global.fetch(url)
        .then(response => {
          if (response.ok) {
            return response.text();
          } else {
            return Promise.reject(`Couldn't fetch captions, have credentials expired?`);
          }
        })
        .then(responseText => {
          if (responseText && responseText.length) {
            resolve(responseText);
          } else {
            reject(`Couldn't fetch captions, response to replay was empty.`);
          }
        })
        .catch(err => {
          reject(`Couldn't fetch captions.`);
        });
    });
  }

  render() {
    let currentCaptionToRender = '';

    if (this.props.adapter.providerInDebugMode) {
      currentCaptionToRender = 'In debug mode...';
    } else if (this.canUseCaptionsFromVideo()) {
      currentCaptionToRender = this.getCaptionToRender();
    }
    return this.props.children(currentCaptionToRender);
  }
};

export default Provider;
