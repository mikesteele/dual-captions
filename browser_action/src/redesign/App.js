import React from 'react';
import { css } from 'emotion';
import Toggle from 'react-toggle';
import config from '../config';
import { applyDCSettings, changeDCLanguage, turnDCOff, turnDCOn } from '../actions';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import 'react-toggle/style.css';

const wrapper = css`
  width: 300px;
  height: 600px;
  background: #f5f5f9;
`;

const header = css`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  line-height: 12px;
  padding: 8px;
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this._switchBackToOldDesign = this._switchBackToOldDesign.bind(this);
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

  render() {
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
              <div className={controlLabel}>On</div>
              <Toggle />
            </div>
          </div>
          <div className={controls}>
            <div className={controlWrapper}>
              <div className={controlLabel}>Second Subtitle Language</div>
              <div className={controlLabel}>No loaded ?</div>
            </div>
          </div>
          <div className={controls}>
            <div className={controlWrapper}>
              <div className={controlLabel}>Space between captions</div>
              <Toggle />
            </div>
            <div className={controlWrapper}>
              <div className={controlLabel}>Custom text color</div>
              <div className={flexbox}>
                Red
                <Toggle />
              </div>
            </div>
            <div className={controlWrapper}>
              <div className={controlLabel}>Small text</div>
              <Toggle />
            </div>
            <div className={controlWrapper}>
              <div className={controlLabel}>Hide action panel</div>
              <Toggle />
            </div>
            <div className={controlWrapper}>
              <div className={controlLabel}>UI Language</div>
              <div className={controlLabel}>English</div>
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

const ConnectedApp = connect(state => ({...state}))(App);

export default ConnectedApp;
