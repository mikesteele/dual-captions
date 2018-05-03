import React, { Component } from 'react';
import { I18n } from 'react-i18next';
import { t } from 'i18next';
import config from '../config';

class SupportedSitesPage extends Component {
  render() {
    const supportedSites = Object.keys(config.supportedSites);
    const sites = supportedSites.map(site => (
      <tr className='site' key={site}>
        <td>{site}</td>
        <td>
          <div>
            <span className={`${config.supportedSites[site]} site-icon`}></span>
            <span>{t(config.supportedSites[site])}</span>
          </div>
        </td>
      </tr>
    ));
    return (
      <I18n namespace='translations'>
      {
        (t) => (
          <div className='page'>
            <table>
              <tbody>
                { sites }
              </tbody> 
            </table>
            <div>{t('beta-explanation')}</div>
          </div>
        )
      }
      </I18n>
    )
  }
}

export default SupportedSitesPage;
