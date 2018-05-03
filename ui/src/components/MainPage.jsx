import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import Toggle from 'react-toggle';
import { changeDCLanguage, turnDCOff, turnDCOn } from '../actions';
import config from '../config';
import Hint from './Hint.jsx';

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
    this.props.dispatch({
      type: 'CHANGE_SECOND_LANGUAGE',
      payload: e.target.value
    });
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
      <I18n namespace='translations'>
      {
        (t) => (
          <div className='page'>
            <Hint/>
            <label>
              <Toggle
                checked={this.props.isOn}
                icons={false}
                onChange={this._onToggleChanged.bind(this)} />
              <div>{ this.props.isOn ? t('on') : t('off') }</div>
            </label>
            <label>
              <select
                value={this.props.secondLanguage}
                onChange={this._onSecondLanguageSelectChanged.bind(this)}>
                { secondLanguages }
              </select>
              <div>{t('second-subtitle-language')}</div>
            </label>
          </div>
        )
      }
      </I18n>
    )
  }
}

export default MainPage;
