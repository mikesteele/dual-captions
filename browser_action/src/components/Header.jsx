import React, { Component } from 'react';
import { connect } from 'react-redux';
const translate = require('dual-captions-translations').translate;

class Header extends Component {
  render() {
    const t = key => translate(this.props.uiLanguage, key);
    return (
      <div>
        <div className='header'>
          <div className='icon'/>
          <div className='title'>
            {t('dual-captions')}
          </div>
        </div>
      </div>
    );
  }
};

export default connect(state => ({...state}))(Header);
