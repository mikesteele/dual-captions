import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import './App.css';
import 'react-toggle/style.css';
import 'react-tabs/style/react-tabs.css';

import Header from './components/Header.jsx';
import MainPage from './components/MainPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import ErrorPage from './components/ErrorPage.jsx';

import { updateStoreFromDC, popupOpened, detectSite } from './actions';

const mapStateToProps = function(state) {
  return {...state};
}

const MainPageView = connect(mapStateToProps)(MainPage);
const SettingsPageView = connect(mapStateToProps)(SettingsPage);
const ErrorPageView = connect(mapStateToProps)(ErrorPage);

class App extends Component {
  componentDidMount() {
    this._inferUILanguage();
    this.props.dispatch(updateStoreFromDC());
    this.props.dispatch(popupOpened());
    this.props.dispatch(detectSite());
  }

  _inferUILanguage() {
    const navigatorLocale = window.navigator.language;
    const navigatorLanguage = navigatorLocale.split('-')[0];
    this.props.dispatch({
      type: 'CHANGE_UI_LANGUAGE',
      payload: navigatorLanguage
    });
  }

  _onUILanguageSelectChanged(e) {
    this.props.dispatch({
      type: 'CHANGE_UI_LANGUAGE',
      payload: e.target.value
    });
  }

  _onTabSelected(tabIndex) {
    this.props.dispatch({
      type: 'CHANGE_CURRENT_TAB',
      payload: tabIndex
    });
  }

  render() {
    return (
      <div className='App'>
        <Header/>
        <Tabs selectedIndex={this.props.currentTab} onSelect={this._onTabSelected.bind(this)}>
          <TabList>
            <Tab>{this.props.t('main')}</Tab>
            <Tab>{this.props.t('settings')}</Tab>
          </TabList>
          <TabPanel>
            <MainPageView/>
          </TabPanel>
          <TabPanel>
            <SettingsPageView/>
          </TabPanel>
        </Tabs>
        <ErrorPageView/>
        { this.props.detectedSite === 'youtube' && (
          <div style={{padding: '16px'}}>
            { /* TODO - Style, change copy */}
            { /* TODO - Translate */}
            Check means the caption caption came from the video.
          </div>
        )}
        <div className='footer'>
          <div>
            <div className='ui-icon'/>
            <select value={this.props.uiLanguage} onChange={this._onUILanguageSelectChanged.bind(this)}>
              <option value='en'>English</option>
              <option value='fr'>Français</option>
            </select>
          </div>
          <div>
            <a
              href='https://chrome.google.com/webstore/detail/two-captions-for-youtube/lpeonmjfimoijceaalocpgjjchocbiap'
              rel='noopener noreferrer'
              target='_blank'>
              {this.props.t('leave-feedback')}
            </a>
            <a
              href='https://github.com/mikesteele/dual-captions/issues'
              rel='noopener noreferrer'
              target='_blank'>
              {this.props.t('report-a-bug')}
            </a>
            <a
              href='https://github.com/mikesteele/dual-captions/'
              rel='noopener noreferrer'
              target='_blank'>
              {this.props.t('view-on-github')}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default translate()(connect(mapStateToProps)(App));
