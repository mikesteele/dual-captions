import React, { Component } from 'react';
import connectAndLocalize from '../connectAndLocalize';

class Hint extends Component {
  render() {
    const { t } = this.props;
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

export default connectAndLocalize(Hint);
