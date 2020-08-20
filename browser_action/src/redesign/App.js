import React, { Fragment } from 'react';
import { css } from 'emotion';
import Toggle from 'react-toggle';
import config from '../config';
import { applyDCSettings, changeDCLanguage, turnDCOff, turnDCOn } from '../actions';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import 'react-toggle/style.css';

const wrapper = css`
  width: 294px;
  padding: 3px;
  height: 600px;
  background: #f5f5f9;
  color: rgba(20, 20, 20, 1);
`;

const header = css`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 14px;
  padding: 14px;
`;

const controls = css`
  display: flex;
  flex-direction: column;
  margin: 8px 0;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px;
  border-radius: 8px;

  &:first-child {
    margin: 0;
  }
`;

const controlWrapper = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(221, 221, 221);
  padding: 8px 16px;
  height: 32px;

  &:last-child {
    border-bottom: none;
  }
`;

const controlLabel = css`
  font-size: 14px;
  line-height: 14px;
  padding: 0;
`;

const flexbox = css`
  display: flex;
  justify-content: center;
  align-content: center;
`;

const colorInput = css`
  width: 48px;
  height: 48px;
  -webkit-appearance: none;
  border: none;
  cursor: pointer;
  position: absolute;
  top: -16px;
  left: -16px;

  &::-webkit-color-swatch-wrapper {
  	padding: 0;
  }
  &::-webkit-color-swatch {
  	border: none;
  }
`;

const colorInputClip = css`
  position: relative;
  overflow: hidden;
  width: 24px;
  height: 24px;
  border: solid 4px #ddd;
  border-radius: 24px;
  margin-right: 16px;
`;

const flexEnd = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this._switchBackToOldDesign = this._switchBackToOldDesign.bind(this);
    this._onToggleChanged = this._onToggleChanged.bind(this);
  }

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

  _switchBackToOldDesign() {
    this.props.dispatch({
      type: 'CHANGE_IS_REDESIGN',
      payload: false
    });
  }

  _onToggleChanged(e) {
    if (e.target.checked) {
      this.props.dispatch(turnDCOn());
    } else {
      this.props.dispatch(turnDCOff());
    }
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
    const { t, isOn, settings } = this.props;
    const checkboxSettings = [
      'delayRenderingUntilTranslation',
      'extraSpace',
      'customColorsEnabled',
      'smallText',
      'hideActionPanel'
    ];
    const defaultSettings = Object.keys(config.defaultSettings);
    const controlElements = defaultSettings
      .filter(setting => checkboxSettings.includes(setting))
      .map(setting => {
        const showColorTool = settings['customColorsEnabled'] && setting === 'customColorsEnabled';
        return (
          <div className={controlWrapper}>
            <div className={controlLabel}>{t(setting)}</div>
            <div className={flexEnd}>
              {showColorTool && (
                <div className={colorInputClip}>
                  <input
                    type='color'
                    className={colorInput}
                    value={settings.customTextColor}
                    onChange={this._onColorInputChange.bind(this, 'customTextColor')}
                  />
                </div>
              )}
              <Toggle
                icons={false}
                checked={settings[setting]}
                onChange={this._onSettingChecked.bind(this, setting)}
              />
            </div>
          </div>
        );
      });
    return (
      <div className={wrapper}>
        <div className={header}>
          <div>{"<-"}</div>
          Dual Captions v2.1
          <div>{"?"}</div>
        </div>
        <div>
          <div className={controls}>
            <div className={controlWrapper}>
              <div className={controlLabel}>
                { isOn ? t('on') : t('off') }
              </div>
              <Toggle
                checked={isOn}
                icons={false}
                onChange={this._onToggleChanged}
              />
            </div>
          </div>
          <div className={controls}>
            <div className={controlWrapper}>
              <div className={controlLabel}>Second Subtitle Language</div>
              <div className={controlLabel}>No loaded ?</div>
            </div>
          </div>
          <div className={controls}>
            {controlElements}
          </div>
        </div>
        <button onClick={this._switchBackToOldDesign}>
          Switch back to old design
        </button>
        <div className={flexbox}>
          Star on GitHub | What's new? <br/>
        </div>
      </div>
    );
  }
};

const ConnectedApp = translate()(connect(state => ({...state}))(App));

export default ConnectedApp;
