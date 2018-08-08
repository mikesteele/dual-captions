import React, { Component } from 'react';
import { I18n } from 'react-i18next';

class Hint extends Component {
  render() {
    return (
      <I18n namespace='translations'>
      {
        (t) => (
          <div className="hint">
            { this.props.detectedSite === 'netflix' && <div>{t('netflix-hint')}</div> }
            { this.props.detectedSite === 'youtube' && <div>{t('youtube-hint')}</div> }
            { this.props.detectedSite === 'amazon'  && <div>{t('amazon-hint')}</div> }
            { this.props.detectedSite === 'none'    && <div>{t('generic-hint')}</div> }
          </div>
        )
      }
      </I18n>
    )
  }
}

export default Hint;
