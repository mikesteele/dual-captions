import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import i18n, { t } from 'i18next';
import { turnDCOff, turnDCOn } from '../actions';
import Hint from './Hint.jsx';

const AVAILABLE_SETTINGS = [
  'extra-space'
]

class SettingsPage extends Component {
  _onSettingChecked(setting, e) {
    if (e.target.checked) {
      alert(setting);
    }
  }

  render() {
    const settings = AVAILABLE_SETTINGS.map(setting => (
      <label>
        <input type='checkbox' onChange={this._onSettingChecked.bind(this, setting)}/>
        <span>{t(setting)}</span>
      </label>
    ));
    return (
      <I18n namespace='translations'>
      {
        (t) => (
          <div className='page'>
            { settings }
          </div>
        )
      }
      </I18n>
    )
  }
}

export default SettingsPage;
