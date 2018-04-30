import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import Toggle from 'react-toggle';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import 'react-toggle/style.css';
import 'react-tabs/style/react-tabs.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isOn: false,
      tabIndex: 0
    };
  }

  _onToggleChanged(e) {
    this.setState({
      isOn: e.target.checked
    });
  }

  _onUILanguageSelectChanged(i18n, e) {
    i18n.changeLanguage(e.target.value);
  }

  _onSecondLanguageSelectChanged(e) {
    this.props.dispatch({
      type: 'CHANGE_SECOND_LANGUAGE',
      payload: e.target.value
    });
  }
  render() {
    return (
      <I18n ns='translations'>
        {
          (t, { i18n }) => (
            <div className='App'>
              <div>{t('dual-captions')}</div>
              <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                <TabList>
                  <Tab>{t('main')}</Tab>
                  <Tab>{t('settings')}</Tab>
                  <Tab>{t('help')}</Tab>
                  <Tab>{t('sites')}</Tab>
                </TabList>
                <TabPanel>
                  <div className='page'>
                    <label>
                      <Toggle
                        defaultChecked={this.state.isOn}
                        icons={false}
                        onChange={this._onToggleChanged.bind(this)} />
                      <div>{ this.state.isOn ? t('on') : t('off') }</div>
                    </label>
                    <label>
                      <div>Store.secondLanguage = {this.props.secondLanguage}</div> {/* TODO - Remove */}
                      <select onChange={this._onSecondLanguageSelectChanged.bind(this)}>
                        <option value='en'>English</option>
                        <option value='fr'>Français</option>
                      </select>
                      <div>{t('second-subtitle-language')}</div>
                    </label>
                    </div>
                </TabPanel>
                <TabPanel>
                  <div className='page'>
                  Settings
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className='page'>
                  Help
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className='page'>
                  Sites
                  </div>
                </TabPanel>
              </Tabs>
              <select onChange={this._onUILanguageSelectChanged.bind(this, i18n)}>
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
              <div>Report a bug &bull; View on GitHub</div>
            </div>
          )
        }
      </I18n>
    );
  }
}

const mapStateToProps = function(state) {
  return {...state};
}

export default connect(mapStateToProps)(App);
