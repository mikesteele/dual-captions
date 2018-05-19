import React, { Component } from 'react';
import { I18n } from 'react-i18next';

class Header extends Component {
  render() {
    return (
      <I18n namespace='translations'>
      {
        (t) => (
          <div>
            <div className='header'>
              <div className='icon'/>
              <div className='title'>
                {t('dual-captions')}
              </div>
            </div>
            <div className='subtitle'>
              {t('supports')}
            </div>
          </div>
        )
      }
      </I18n>
    )
  }
}

export default Header;
