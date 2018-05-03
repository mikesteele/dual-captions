import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import { t } from 'i18next';
import config from '../config';

class SettingsPage extends Component {
  _onSettingChecked(setting, e) {
    this.props.dispatch({
      type: 'CHANGE_SETTINGS',
      payload: {
        [setting]: e.target.checked
      }
    });
  }

  render() {
    const defaultSettings = Object.keys(config.defaultSettings);
    const settings = defaultSettings.map(setting => (
      <label key={setting}>
        <input
          type='checkbox'
          checked={this.props.settings[setting]}
          onChange={this._onSettingChecked.bind(this, setting)}/>
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
