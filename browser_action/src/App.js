import React, { Component } from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import packageJson from '../package.json';

import './App.css';
import 'react-toggle/style.css';
import 'react-tabs/style/react-tabs.css';

import Header from './components/Header.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import TranslationQueue from './components/TranslationRequest.jsx';
import ToolsPage from './components/ToolsPage.jsx';

import { determineState, popupOpened, detectSite, checkLoadedLanguages, changeUILanguage } from './actions';


// Redesign
import MainPage from './redesign/MainPage';
import Footer from './redesign/Footer';

const mapStateToProps = function(state) {
  return {...state};
}



const tabs = [
  { title: 'First Tab' },
  { title: 'Second Tab' },
  { title: 'Third Tab' },
];



const MainPageView = connect(mapStateToProps)(MainPage);
const SettingsPageView = connect(mapStateToProps)(SettingsPage);
const ErrorPageView = connect(mapStateToProps)(ErrorPage);
const ToolsPageView = connect(mapStateToProps)(ToolsPage);

class App extends Component {
  componentDidMount() {
    window.setInterval(this.checkLoadedLanguages.bind(this), 2 * 1000);
    this.props.dispatch(determineState())
      .then(this.props.dispatch(popupOpened()))
      .then(this.props.dispatch(detectSite()))
      .catch(err => {
        console.log(err);
      });
  }

  checkLoadedLanguages() {
    this.props.dispatch(checkLoadedLanguages());
  }

  _onUILanguageSelectChanged(e) {
    this.props.dispatch(changeUILanguage(e.target.value));
  }

  _onTabSelected(tabIndex) {
    this.props.dispatch({
      type: 'CHANGE_CURRENT_TAB',
      payload: tabIndex
    });
  }

  render() {
    const { t } = this.props;
    const showToolsPage = this.props.loadedLanguages.length > 0;
    return (
      <div className='App'>
        <MainPage />
        <Footer />
      </div>
    );
  }
}

export default translate()(connect(mapStateToProps)(App));
