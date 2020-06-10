import React, { Component } from 'react';
import { I18n } from 'react-i18next';

class Hint extends Component {
  render() {
    return (
      <I18n namespace='translations'>
      {
        (t) => {
          let hint = t('generic-hint');
          if (this.props.detectedSite === 'netflix') {
            hint = t('netflix-hint');
          } else if (this.props.detectedSite === 'youtube') {
            hint = t('youtube-hint');
          }
          return (
            <div className="hint">
               <div>{hint}</div>
            </div>
          );
        }
      }
      </I18n>
    )
  }
}

export default Hint;
