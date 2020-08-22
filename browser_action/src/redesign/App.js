import React, { Fragment } from 'react';
import { css } from 'emotion';
import Toggle from 'react-toggle';
import config from '../config';
import { applyDCSettings, changeDCLanguage, changeUILanguage, turnDCOff, turnDCOn } from '../actions';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Modal, Select } from 'antd';
import 'react-toggle/style.css';
import cn from 'classnames';
const { Option } = Select;

const wrapper = css`
  width: 100%;
  padding: 0px 12px;
  height: 600px;
  background: #f5f5f9;
  color: rgba(20, 20, 20, 1);
`;

const sourceSansPro = css`
  font-family: 'Source Sans Pro', sans-serif;
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
  margin: 16px 0;
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
  height: 44px;

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

const uiIcon = css`
  background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDcuNSA0Ny41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0Ny41IDQ3LjU7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB2ZXJzaW9uPSIxLjEiIGlkPSJzdmcyIj48bWV0YWRhdGEgaWQ9Im1ldGFkYXRhOCI+PHJkZjpSREY+PGNjOldvcmsgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMgaWQ9ImRlZnM2Ij48Y2xpcFBhdGggaWQ9ImNsaXBQYXRoMTYiIGNsaXBQYXRoVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBpZD0icGF0aDE4IiBkPSJNIDAsMzggMzgsMzggMzgsMCAwLDAgMCwzOCBaIi8+PC9jbGlwUGF0aD48L2RlZnM+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMS4yNSwwLDAsLTEuMjUsMCw0Ny41KSIgaWQ9ImcxMCI+PGcgaWQ9ImcxMiI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXBQYXRoMTYpIiBpZD0iZzE0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNi4zNTc0LDQuODAxOCkiIGlkPSJnMjAiPjxwYXRoIGlkPSJwYXRoMjIiIHN0eWxlPSJmaWxsOiMzYjg4YzM7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUiIGQ9Im0gMCwwIGMgMS4wMTQsMS4xODQgMS45MDIsMi41OTQgMi42MTksNC4xOTggbCAyLjUwMywwIEMgMy43MzEsMi40NjUgMS45ODgsMS4wMzIgMCwwIG0gLTE5LjgzNyw0LjE5OCAyLjUwMywwIGMgMC43MTYsLTEuNjA0IDEuNjA1LC0zLjAxNCAyLjYxOSwtNC4xOTggLTEuOTg5LDEuMDMyIC0zLjczMSwyLjQ2NSAtNS4xMjIsNC4xOTggbSA1LjEyMiwyNC4xOTkgYyAtMS4wMTQsLTEuMTg0IC0xLjkwMywtMi41OTQgLTIuNjE5LC00LjE5OSBsIC0yLjUwMywwIGMgMS4zOTEsMS43MzQgMy4xMzQsMy4xNjYgNS4xMjIsNC4xOTkgbSAxOS44MzcsLTQuMTk5IC0yLjUwMywwIEMgMS45MDIsMjUuODAzIDEuMDE0LDI3LjIxMyAwLDI4LjM5NyAxLjk4OCwyNy4zNjUgMy43MzEsMjUuOTMyIDUuMTIyLDI0LjE5OCBtIC0wLjUxMywtOSBjIC0wLjA5MiwyLjUwNiAtMC41MjIsNC44NzEgLTEuMjI4LDcgbCAzLjEwMywwIGMgMS4yMDcsLTIuMDgyIDEuOTUxLC00LjQ1OSAyLjEwOCwtNyBsIC0zLjk4MywwIHogbSAwLC0yIDMuOTgzLDAgQyA4LjQzNSwxMC42NTcgNy42OTEsOC4yODEgNi40ODQsNi4xOTggbCAtMy4xMDMsMCBjIDAuNzA2LDIuMTI5IDEuMTM2LDQuNDk0IDEuMjI4LDcgbSAtMTAuOTY2LC03IDAsNyA4Ljk2OCwwIEMgMi41MTMsMTAuNjU3IDIuMDQ4LDguMjgxIDEuMjk0LDYuMTk4IGwgLTcuNjUxLDAgeiBtIDAsLTcuOTE5IDAsNS45MTkgNi43OTksMCBDIC0xLjE5NCwwLjkzNSAtMy42MSwtMS4yODQgLTYuMzU3LC0xLjcyMSBtIC0yLDUuOTE5IDAsLTUuOTE5IGMgLTIuNzQ3LDAuNDM3IC01LjE2NCwyLjY1NiAtNi44LDUuOTE5IGwgNi44LDAgeiBtIC04Ljk2OSw5IDguOTY5LDAgMCwtNyAtNy42NTIsMCBjIC0wLjc1NCwyLjA4MyAtMS4yMTksNC40NTkgLTEuMzE3LDcgbSAtMS45OTgsMiAtMy45ODMsMCBjIDAuMTU4LDIuNTQxIDAuOTAxLDQuOTE4IDIuMTA3LDcgbCAzLjEwNSwwIGMgLTAuNzA3LC0yLjEyOSAtMS4xMzYsLTQuNDk0IC0xLjIyOSwtNyBtIDEwLjk2Nyw3IDAsLTcgLTguOTY5LDAgYyAwLjA5OCwyLjU0MSAwLjU2Myw0LjkxNyAxLjMxNyw3IGwgNy42NTIsMCB6IG0gMCw3LjkyIDAsLTUuOTIgLTYuOCwwIGMgMS42MzcsMy4yNjQgNC4wNTMsNS40ODMgNi44LDUuOTIgbSA5LjY1MSwtNy45MiBjIDAuNzU0LC0yLjA4MyAxLjIxOSwtNC40NTkgMS4zMTcsLTcgbCAtOC45NjgsMCAwLDcgNy42NTEsMCB6IG0gLTcuNjUxLDIgMCw1LjkyIGMgMi43NDcsLTAuNDM3IDUuMTYyLC0yLjY1NiA2Ljc5OCwtNS45MiBsIC02Ljc5OCwwIHogbSAtMTYuOTUsLTExIDMuOTgzLDAgYyAwLjA5MiwtMi41MDYgMC41MjIsLTQuODcxIDEuMjI5LC03IGwgLTMuMTA1LDAgYyAtMS4yMDYsMi4wODMgLTEuOTQ5LDQuNDU5IC0yLjEwNyw3IG0gMTUuOTUsMTkgYyAtOS45NDEsMCAtMTgsLTguMDU5IC0xOCwtMTggMCwtOS45NDEgOC4wNTksLTE4IDE4LC0xOCA5Ljk0MSwwIDE4LDguMDU5IDE4LDE4IDAsOS45NDEgLTguMDU5LDE4IC0xOCwxOCIvPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4K");
  display: inline-block;
  height: 24px;
  width: 24px;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this._switchBackToOldDesign = this._switchBackToOldDesign.bind(this);
    this._onToggleChanged = this._onToggleChanged.bind(this);
    this._onUILanguageSelectChanged = this._onUILanguageSelectChanged.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { dispatch, errorType, t, hasError, uiLanguage } = this.props;
    const isChinese = uiLanguage === 'zh-tw';
    if (!prevProps.hasError && hasError) {
      const onOk = () => {
        dispatch({
          type: 'CHANGE_ERROR',
          payload: {
            hasError: false,
            errorType: ''
          }
        });
      }
      Modal.error({
        content: t(errorType),
        onOk: onOk,
        className: cn({
          [sourceSansPro]: !isChinese
        })
      });
    }
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

  _onUILanguageSelectChanged(value) {
    this.props.dispatch(changeUILanguage(value));
  }

  render() {
    const { t, isOn, settings, uiLanguage } = this.props;
    const checkboxSettings = [
      'delayRenderingUntilTranslation',
      'extraSpace',
      'customColorsEnabled',
      'smallText',
      'hideActionPanel'
    ];
    const isChinese = uiLanguage === 'zh-tw';
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
      <div className={cn(wrapper, { [sourceSansPro]: !isChinese })}>
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
              {/* TODO - Needs ERROR!! */}
            </div>
          </div>
          <div className={controls}>
            <div className={controlWrapper}>
              <div className={controlLabel}>Second Subtitle Language</div>
              <div className={flexEnd}>
                <Select defaultValue="lucy" style={{ width: 100 }} onChange={() => {}}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                </Select>
              </div>
            </div>
          </div>
          <div className={controls}>
            {controlElements}
          </div>
          <div className={controls}>
            <div className={controlWrapper}>
              <div className={controlLabel}>
                <div className={uiIcon} />
              </div>
              <div className={flexEnd}>
                <Select value={uiLanguage} style={{width: 100}} onChange={this._onUILanguageSelectChanged}>
                  <Option value='en'>English</Option>
                  <Option value='fr'>Français</Option>
                  <Option value='zh-tw'>中文 (繁體)</Option>
                </Select>
              </div>
            </div>
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
