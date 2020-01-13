import React, { Component, Fragment } from 'react';
import Toggle from 'react-toggle';
import { changeDCLanguage, turnDCOff, turnDCOn } from '../actions';
import config from '../config';
import Hint from './Hint.jsx';
import Step from './Step.jsx';
import { translate } from 'react-i18next';

class MainPage extends Component {
  _onToggleChanged(e) {
    if (e.target.checked) {
      this.props.dispatch(turnDCOn());
    } else {
      this.props.dispatch(turnDCOff());
    }
  }

  _onSecondLanguageSelectChanged(e) {
    this.props.dispatch(changeDCLanguage(e.target.value));
  }

  render() {
    const secondLanguages = this.props.loadedLanguages.map(language => (
      <option
        key={language}
        value={language}>
        {config.secondLanguages[language]}
      </option>
    ));
    const loadedLanguages = this.props.loadedLanguages.map(lang => config.secondLanguages[lang] || lang);
    return (
      <div className='page'>
        <Step stepNumber={1}>
          <Hint detectedSite={this.props.detectedSite} loadedLanguages={this.props.loadedLanguages}/>
        </Step>
        <Step stepNumber={2}>
          <div>
            <div>
              {this.props.t('netflix-step-2-part-2')}
            </div>
            {this.props.loadedLanguages.length > 0 && (
              <div style={{marginTop: '16px'}}>
                {this.props.t('netflix-step-2-part-3')} {loadedLanguages.join(', ')}
              </div>
            )}
          </div>
        </Step>
        <Step stepNumber={3}>
          <Fragment>
            <label>
              <Toggle
                checked={this.props.isOn}
                icons={false}
                onChange={this._onToggleChanged.bind(this)} />
              <div>{ this.props.isOn ? this.props.t('on') : this.props.t('off') }</div>
            </label>
            <label>
              <select
                value={this.props.secondLanguage}
                onChange={this._onSecondLanguageSelectChanged.bind(this)}>
                  <option value='none' key='none'></option>
                  { secondLanguages }
              </select>
              <div>{this.props.t('second-subtitle-language')}</div>
            </label>
          </Fragment>
        </Step>
      </div>
    )
  }
}

export { MainPage };
export default translate()(MainPage);
