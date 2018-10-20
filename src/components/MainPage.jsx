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
    const secondLanguagesKeys = Object.keys(config.secondLanguages);
    const secondLanguages = secondLanguagesKeys.map(language => (
      <option
        key={language}
        value={language}>
        {config.secondLanguages[language]}
      </option>
    ));
    return (
      <div className='page'>
        <Step stepNumber={1}>
          <Hint detectedSite={this.props.detectedSite} loadedLanguages={this.props.loadedLanguages}/>
        </Step>
        {this.props.detectedSite === 'netflix' && (
          <Step stepNumber={2}>
            <div>
              {/* TODO - Translate */}
              <div>
                To use subtitles from this video, select and unselect subtitle languages on Netflix to load them into this app.
              </div>
              <br/>
              {this.props.loadedLanguages.length && (
                <div>
                  {/* TODO - Translate */}
                  Subtitles from the video loaded: {this.props.loadedLanguages.join(',')}
                </div>
              )}
            </div>
          </Step>
        )}
        <Step stepNumber={this.props.detectedSite === 'netflix' ? 3 : 2}>
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
