import React from 'react';
import { StickyPopper } from './Popper';
import { MdEdit } from 'react-icons/md';
// import MdEdit from 'react-icons/lib/md/edit';

const SUPPORTED_LANGUAGES = {
  af: "Afrikaans",
  sq: "Albanian",
  am: "Amharic",
  ar: "Arabic",
  hy: "Armenian",
  az: "Azerbaijani",
  eu: "Basque",
  be: "Belarusian",
  bn: "Bengali",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  ceb: "Cebuano",
  ny: "Chichewa",
  "zh-cn": "Chinese Simplified",
  "zh-tw": "Chinese Traditional",
  co: "Corsican",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  eo: "Esperanto",
  et: "Estonian",
  tl: "Filipino",
  fi: "Finnish",
  fr: "French",
  fy: "Frisian",
  gl: "Galician",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  gu: "Gujarati",
  ht: "Haitian Creole",
  ha: "Hausa",
  haw: "Hawaiian",
  iw: "Hebrew",
  hi: "Hindi",
  hmn: "Hmong",
  hu: "Hungarian",
  is: "Icelandic",
  ig: "Igbo",
  id: "Indonesian",
  ga: "Irish",
  it: "Italian",
  ja: "Japanese",
  jw: "Javanese",
  kn: "Kannada",
  kk: "Kazakh",
  km: "Khmer",
  ko: "Korean",
  ku: "Kurdish (Kurmanji)",
  ky: "Kyrgyz",
  lo: "Lao",
  la: "Latin",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mg: "Malagasy",
  ms: "Malay",
  ml: "Malayalam",
  mt: "Maltese",
  mi: "Maori",
  mr: "Marathi",
  mn: "Mongolian",
  my: "Myanmar (Burmese)",
  ne: "Nepali",
  no: "Norwegian",
  ps: "Pashto",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  ma: "Punjabi",
  ro: "Romanian",
  ru: "Russian",
  sm: "Samoan",
  gd: "Scots Gaelic",
  sr: "Serbian",
  st: "Sesotho",
  sn: "Shona",
  sd: "Sindhi",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  es: "Spanish",
  su: "Sundanese",
  sw: "Swahili",
  sv: "Swedish",
  tg: "Tajik",
  ta: "Tamil",
  te: "Telugu",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  vi: "Vietnamese",
  cy: "Welsh",
  xh: "Xhosa",
  yi: "Yiddish",
  yo: "Yoruba",
  zu: "Zulu"
};

const SettingControls = props => {
  const { adapter, settings, currentCaptionToRender, isOn, videoId } = props;
  return (
    <StickyPopper
      target={adapter.playerControls}
      placement="top-end"
      updateInfrequently
    >
      <div
        style={{
          background: "#0d0d0d",
          color: "#E1E1E1",
          boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.5)",
          display: "inline-flex",
          padding: "32px",
          borderRadius: "8px",
          fontFamily: "sans-serif",
          fontSize: "20px",
          lineHeight: "24px",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div
          style={{
            fontSize: '16px',
            marginBottom: '8px',
            lineHeight: '20px'
          }}>
          Second subtitle language
        </div>
        <div
          style={{
            fontSize: "16px",
            padding: "8px 16px",
            background: "#913bfa",
            marginTop: "4px",
            textAlign: "center",
            borderRadius: "4px",
            width: 124,
            position: "relative",
            cursor: "pointer"
          }}
        >
          {SUPPORTED_LANGUAGES[settings.secondSubtitleLanguage] ||
            settings.secondSubtitleLanguage}
          <div
            style={{
              position: "absolute",
              right: 8,
              top: 10
            }}
          >
            <MdEdit />
          </div>
        </div>
      </div>
    </StickyPopper>
  );
};

export default SettingControls;
