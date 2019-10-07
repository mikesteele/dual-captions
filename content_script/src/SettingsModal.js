import React from 'react';
import Modal from './Modal';
import SettingControls from './SettingControls';
import translate from './utils/translate';

const SettingsModal = props => {
  const {
    adapter,
    settings,
    isOpen,
    onClose,
    provider,
    videoId,
    site,
    isOn,
    currentCaptionToRender
  } = props;
  const t = key => translate(settings.uiLanguage, key);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('settings')}
    >
      <SettingControls
        adapter={adapter}
        currentCaptionToRender={currentCaptionToRender}
        settings={settings}
        isOn={isOn}
        videoId={videoId}
        provider={provider}
        site={site}
      />
    </Modal>
  )
}

export default SettingsModal;
