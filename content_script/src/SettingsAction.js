import React from 'react';
import ActionButton from './ActionButton';
import translate from './utils/translate';
import { MdSettings } from 'react-icons/md';

const SettingsAction = props => {
  const {
    settings,
    adapter,
    isOn,
    openSettingsModal
  } = props;
  const t = key => translate(settings.uiLanguage, key);
  return (
    <ActionButton
      onClick={openSettingsModal}
      tooltipText={t('settings')}
      settings={settings}
      adapter={adapter}
      isOn={isOn}
    >
      <MdSettings />
    </ActionButton>
  )
}

export default SettingsAction;
