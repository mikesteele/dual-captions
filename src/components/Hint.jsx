import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import { getActiveTabId } from '../utils/chrome.js';

class Hint extends Component {
  constructor() {
    super();
    this.state = {
      detectedSite: ''
    };
  }

  componentDidMount() {
    if (window.chrome) {
      getActiveTabId()
        .then(tabId => {
          return new Promise(_resolve => {
            window.chrome.tabs.sendMessage(tabId, {
              type: 'detect-site',
            }, _resolve);
          });
        })
        .then(response => {
          if (response.ok) {
            this.setState({
              detectedSite: response.site
            });
          }
        })
        .catch(() => {});
    }
  }

  render() {
    return (
      <I18n namespace='translations'>
      {
        (t) => (
          <div>
          <div>{this.state.detectedSite}</div>
          <div className='hint'>
            {t('hint-text')}
          </div>
          </div>
        )
      }
      </I18n>
    )
  }
}

export default Hint;
