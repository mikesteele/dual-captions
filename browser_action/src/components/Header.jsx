import React, { Component } from 'react';
import connectAndLocalize from '../connectAndLocalize';

class Header extends Component {
  render() {
    const { t } = this.props;
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

export default connectAndLocalize(Header);
