import React, { Component, Fragment } from 'react';
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

  _onColorInputChange(setting, e) {
    this.props.dispatch({
      type: 'CHANGE_SETTINGS',
      payload: {
        [setting]: e.target.value
      }
    });
    this.props.dispatch(applyDCSettings());
  }

  render() {
    const checkboxSettings = [
      'delayRenderingUntilTranslation',
      'extraSpace',
      'customColorsEnabled',
      'smallText'
    ];
    const defaultSettings = Object.keys(config.defaultSettings);
    const settings = defaultSettings.map(setting => (
      <Fragment>
        { checkboxSettings.includes(setting) && (
          <div>
            <label key={setting}>
              <input
                type='checkbox'
                checked={this.props.settings[setting]}
                onChange={this._onSettingChecked.bind(this, setting)}/>
              <span>{this.props.t(setting)}</span>
            </label>
          </div>
        )}
        { setting === 'customColorsEnabled' && (
          <div
            className='colors-container'
            hidden={!this.props.settings.customColorsEnabled}>
            <label>
              <input
                type='color'
                value={this.props.settings.customTextColor}
                onChange={this._onColorInputChange.bind(this, 'customTextColor')}
              />
              <span>{this.props.t('customTextColor')}</span>
            </label>
          </div>
        )}
      </Fragment>
    ));
    return (
      <div className='page'>
        <div className='settings-page'>
          { settings }
        </div>
      </div>
    )
  }
}

export { SettingsPage };
export default translate()(SettingsPage);
