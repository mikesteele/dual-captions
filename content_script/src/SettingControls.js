import React, { Fragment } from 'react';
import { StickyPopper } from './Popper';
import { MdEdit, MdPlay, MdClose } from 'react-icons/md';
// import MdEdit from 'react-icons/lib/md/edit';
import { FaPlay } from 'react-icons/fa';
// TODO - import FaPlay from
import Fade from './Fade';
import translate from './utils/translate';

const title = str => str.replace(/^\w/, c => c.toUpperCase());

const ActionTooltip = props => (
  <div
    style={{
      backgroundColor: "#202020",
      color: "#E1E1E1",
      boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.5)",
      display: "inline-flex",
      padding: "16px",
      borderRadius: "8px",
      fontFamily: "sans-serif",
      fontSize: "20px",
      lineHeight: "24px",
      position: "relative",
      margin: "32px",
      justifyContent: "center",
      alignItems: "flex-start",
      width: "200px"
    }}
  >
    {props.children}
    <div
      style={{
        width: 24,
        marginLeft: 24,
        fontSize: 20,
        lineHeight: 20,
        height: 20,
        display: 'inline-flex',
      }}
    >
      <MdClose
        onClick={props.onClickClose}
        style={{
          cursor: 'pointer'
        }}
       />
    </div>
    <div
      style={{
        position: "absolute",
        height: "100%",
        top: 0,
        left: "-24px",
        fontSize: "32px",
        lineHeight: "32px",
        display: "flex",
        alignItems: "center",
        color: "#202020",
        transform: "scaleX(-1)"
      }}
    >
      <FaPlay />
    </div>
  </div>
);

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
  zh: "Chinese",
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

class SettingControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actionTooltopOpen: false
    }
    this.selectRef = React.createRef();
    this.openActionTooltip = this.openActionTooltip.bind(this);
    this.renderMaterial = this.renderMaterial.bind(this);
    this.renderActionTooltip = this.renderActionTooltip.bind(this);
  }

  openActionTooltip() {
    this.setState({
      actionTooltopOpen: true
    })
  }

  renderMaterial() {
    const { adapter, settings } = this.props;
    const t = key => translate(settings.uiLanguage, key);
    return (
      <div
        style={{
          color: "#E1E1E1",
          display: "inline-flex",
          padding: "16px",
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
          }}
        >
          {t('second-subtitle-language')}
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
          onClick={this.openActionTooltip}
          ref={this.selectRef}
        >
          {SUPPORTED_LANGUAGES[settings.secondSubtitleLanguage] ||
            title(settings.secondSubtitleLanguage)}
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
    );
  }

  renderActionTooltip() {
    const { provider, settings, site } = this.props;
    const t = key => translate(settings.uiLanguage, key);
    let currentSite = '';
    if (site === 'youtube') {
      currentSite = 'YouTube';
    } else if (site === 'netflix') {
      currentSite = 'Netflix';
    }
    const langsToRender = ['none', ...provider.loadedLanguages];
    return (
      <StickyPopper
        target={this.selectRef ? this.selectRef.current : null}
        placement="right"
      >
        <ActionTooltip
          onClickClose={() => {
            this.setState({
              actionTooltopOpen: false
            });
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                marginBottom: provider.loadedLanguages.length > 0 ? "40px" : "0px"
              }}
            >
              {provider.loadedLanguages.length > 0 && langsToRender.map(lang => (
                 <div
                   style={{
                     fontSize: "20px",
                     padding: "8px 16px",
                     background: "#454545",
                     textAlign: "center",
                     borderRadius: "4px",
                     marginBottom: "8px",
                     cursor: "pointer"
                   }}
                   key={lang}
                   onClick={() => {
                     settings.changeSetting('secondSubtitleLanguage', lang, true);
                     this.setState({
                       actionTooltopOpen: false
                     });
                   }}
                 >
                   {SUPPORTED_LANGUAGES[lang] || title(lang)}
                 </div>
              ))}
            </div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: "20px",
                  textAlign: "center",
                  marginBottom: "8px"
                }}
              >
                {t(`load-hint-${site}`)}
              </div>
            </div>
          </div>
        </ActionTooltip>
      </StickyPopper>
    );
  }

  render() {
    const { adapter, settings, currentCaptionToRender, isOn, videoId } = this.props;
    const { isHoveredOver, actionTooltopOpen } = this.state;
    const shouldShowTooltip = actionTooltopOpen && videoId;
    return (
      <Fragment>
        { this.renderMaterial() }
        { shouldShowTooltip && this.renderActionTooltip() }
      </Fragment>
    );
  }
}

export default SettingControls;
