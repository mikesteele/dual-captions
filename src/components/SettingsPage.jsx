import React, { Component } from 'react';
import config from '../config';
import { applyDCSettings } from '../actions';
import { translate } from 'react-i18next';

class SettingsPage extends Component {
  _onSettingChecked(setting, e) {
    this.props.dispatch({
      type: 'CHANGE_SETTINGS',
      payload: {
        [setting]: e.target.checked
      }
    });
    this.props.dispatch(applyDCSettings());
  }

  render() {
    const defaultSettings = Object.keys(config.defaultSettings);
    const settings = defaultSettings.map(setting => (
      <label key={setting}>
        <input
          type='checkbox'
          checked={this.props.settings[setting]}
          onChange={this._onSettingChecked.bind(this, setting)}/>
        <span>{this.props.t(setting)}</span>
      </label>
    ));
    return (
      <div className='page'>
        { settings }
      </div>
    )
  }
}

export { SettingsPage };
export default translate()(SettingsPage);

