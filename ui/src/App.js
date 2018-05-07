import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import './App.css';
import 'react-toggle/style.css';
import 'react-tabs/style/react-tabs.css';

import Header from './components/Header.jsx';
import MainPage from './components/MainPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import SupportedSitesPage from './components/SupportedSitesPage.jsx';

import { updateStoreFromDC } from './actions';

const mapStateToProps = function(state) {
  return {...state};
}

const MainPageView = connect(mapStateToProps)(MainPage);
const SettingsPageView = connect(mapStateToProps)(SettingsPage);
const ErrorPageView = connect(mapStateToProps)(ErrorPage);

class App extends Component {
  componentDidMount() {
    if (window.chrome && window.chrome.storage) {
      window.chrome.storage.local.get('__DC_store__', result => {
        const savedStore = result.__DC_store__;
        if (savedStore) {
          const savedStoreJSON = JSON.parse(savedStore);
          if (savedStoreJSON.DC) {
            this.props.dispatch({
              type: 'HYDRATE_STORE',
              payload: savedStoreJSON
            });
          }
          this.props.dispatch(updateStoreFromDC());
        } else {
          // MS: If no saved store, infer UI language
          this._inferUILanguage();
          this.props.dispatch(updateStoreFromDC());
        }
      });
    } else {
      this._inferUILanguage();
      this.props.dispatch(updateStoreFromDC());
    }
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
      <I18n ns='translations'>
        {
          (t, { i18n }) => (
            <div className='App'>
              <Header/>
              <Tabs selectedIndex={this.props.currentTab} onSelect={this._onTabSelected.bind(this)}>
                <TabList>
                  <Tab>{t('main')}</Tab>
                  <Tab>{t('settings')}</Tab>
                  <Tab>{t('supported-sites')}</Tab>
                </TabList>
                <TabPanel>
                  <MainPageView/>
                </TabPanel>
                <TabPanel>
                  <SettingsPageView/>
                </TabPanel>
                <TabPanel>
                  <SupportedSitesPage/>
                </TabPanel>
              </Tabs>
              <ErrorPageView/>
              <select value={this.props.uiLanguage} onChange={this._onUILanguageSelectChanged.bind(this)}>
                <option value='en'>English</option>
                <option value='fr'>French</option>
              </select>
              <div>Report a bug &bull; View on GitHub</div>
            </div>
          )
        }
      </I18n>
    );
  }
}

export default connect(mapStateToProps)(App);
