import React from 'react';
import Modal from './Modal';
import SettingControls from './SettingControls';
import translate from './utils/translate';
import { FaPlay } from 'react-icons/fa';
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';

const Other = () => {
  console.log('rendering');
  return null;
}

const TextColorControl = props => {
  const { settings } = props;
  const t = key => translate(settings.uiLanguage, key);
  const wrapperStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px'
  };
  const onChange = e => {
    settings.changeSetting('customTextColor', e.target.value);
  }
  return (
    <div style={wrapperStyles}>
      <div>{t('customTextColor')}</div>
      <input
        type='color'
        value={settings.customTextColor}
        onChange={onChange}
      />
    </div>
  )
}

const CheckboxControl = props => {
  const {
    changeSetting,
    settingKey,
    label,
    isChecked
  } = props;
  const wrapperStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px'
  };
  const iconStyles = {
    color: '#913bfa',
    fontSize: '32px',
    cursor: 'pointer'
  };
  const icon = isChecked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />;
  const onClick = () => {
    changeSetting(settingKey, !isChecked);
  }
  console.log('renreding')
  return (
    <div style={wrapperStyles}>
      <div>{label}</div>
      <div style={iconStyles} onClick={onClick}>
        {icon}
      </div>
      <Other/>
    </div>
  )
}

const VideoSpeedControl = props => {
  const { adapter, settings } = props;
  const t = key => translate(settings.uiLanguage, key);
  if (!adapter.video) {
    // Can't adjust speed at the moment if not using a <video>
    return null;
  }
  const onChange = e => {
    const videoSpeed = e.target.value;
    adapter.video.playbackRate = Number(videoSpeed);
  }
  const wrapperStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px'
  }
  const selectStyles = {
    appearance: 'none',
    '-webkit-appearance': 'none',
    padding: '8px 30px 8px 16px',
    fontSize: '16px',
    background: '#913bfa',
    color: 'white',
    border: 'none'
  }
  const arrowStyles = {
    position: "absolute",
    top: "14px",
    right: "8px",
    fontSize: "8px",
    lineHeight: "8px",
    color: "#FFF",
    transform: "rotateZ(90deg)",
    pointerEvents: "none"
  }
  const selectContainerStyles = {
    display: 'inline-block',
    position: 'relative'
  }
  return (
    <div style={wrapperStyles}>
      <div>{t('video-speed')}</div>
      <div style={selectContainerStyles}>
        <select
          onChange={onChange}
          value={String(adapter.video.playbackRate)}
          style={selectStyles}
        >
          <option value="0.25">0.25</option>
          <option value="0.5">0.5</option>
          <option value="0.75">0.75</option>
          <option value="1">1</option>
          <option value="1.25">1.25</option>
          <option value="1.5">1.5</option>
          <option value="1.75">1.75</option>
          <option value="2">2</option>
        </select>
        <div style={arrowStyles}>
          <FaPlay />
        </div>
      </div>
    </div>
  )
}

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
      <VideoSpeedControl
        adapter={adapter}
        settings={settings}
      />
      <CheckboxControl
        changeSetting={settings.changeSetting}
        settingKey='smallText'
        label={t('smallText')}
        isChecked={settings['smallText']}
      />
      <CheckboxControl
        changeSetting={settings.changeSetting}
        settingKey='extraSpace'
        label={t('extraSpace')}
        isChecked={settings['extraSpace']}
      />
      <CheckboxControl
        changeSetting={settings.changeSetting}
        settingKey='customColorsEnabled'
        label={t('customColorsEnabled')}
        isChecked={settings['customColorsEnabled']}
      />
      {settings.customColorsEnabled && (
        <TextColorControl
          settings={settings}
        />
      )}
    </Modal>
  )
}

export { CheckboxControl };
export default SettingsModal;
