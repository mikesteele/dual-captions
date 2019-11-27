import React from 'react';
import s from './App.styles.js';
import translate from './translate';

const NeonApp = () => {
  const t = key => translate('en', key);
  return (
    <div className={s.Wrapper}>
      <h1 className={s.Heading}>
        {t('dual-captions')}
      </h1>
      <h2 className={s.Subheading}>
        YouTube & Netflix
      </h2>
    </div>
  );
};

export default NeonApp;
