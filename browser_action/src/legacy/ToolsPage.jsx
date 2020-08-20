import React from 'react';
import config from '../config';
import { translate } from 'react-i18next';
import { sendMessageToActiveTab } from '../utils/chrome';

const Link = props => (
  <button {...props} style={{
    appearance: 'none',
    '-webkit-appearance': 'none',
    color: '#2980b9',
    textDecoration: 'underline',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    fontSize: '14px'
  }}/>
);

const ToolsPage = props => {
  const {
    loadedLanguages,
    t
  } = props;
  const onClickLang = (lang) => {
    sendMessageToActiveTab({
      type: 'download-subtitles',
      payload: lang
    }).then(() => {
      // No-op
    }).catch(err => {
      console.error(err);
    });
  };
  return (
    <div className='page'>
      {t('download-subtitles')}
      {loadedLanguages.map(lang => (
        <Link onClick={() => onClickLang(lang)}>
          {config.secondLanguages[lang]}
        </Link>
      ))}
    </div>
  )
}

export default translate()(ToolsPage);
