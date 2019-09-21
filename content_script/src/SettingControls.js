import React, { Fragment } from 'react';
import { StickyPopper } from './Popper';
import { MdEdit, MdPlay } from 'react-icons/md';
// import MdEdit from 'react-icons/lib/md/edit';
import { FaPlay } from 'react-icons/fa';
// TODO - import FaPlay from

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
      margin: "32px"
    }}
  >
    {props.children}
    <div
      style={{
        position: "absolute",
        height: "100%",
        top: 0,
        right: "-24px",
        fontSize: "32px",
        lineHeight: "32px",
        display: "flex",
        alignItems: "center",
        color: "#202020"
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
            }}
          >
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
            onClick={this.openActionTooltip}
            ref={this.selectRef}
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
  }

  renderActionTooltip() {
    return (
      <StickyPopper
        target={this.selectRef ? this.selectRef.current : null}
        placement="left"
        updateInfrequently
      >
        <ActionTooltip>
          <div
            style={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                marginBottom: "40px"
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  padding: "8px 16px",
                  background: "#454545",
                  textAlign: "center",
                  borderRadius: "4px"
                }}
              >
                Italian
              </div>
              <div
                style={{
                  fontSize: "20px",
                  padding: "8px 16px",
                  background: "#913bfa",
                  marginTop: "4px",
                  textAlign: "center",
                  borderRadius: "4px"
                }}
              >
                English
              </div>
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
                Load languages by
                <br />
                selecting them on Netflix.
              </div>
              <div
                style={{
                  fontSize: "16px",
                  padding: "8px 16px",
                  background: "#913bfa",
                  marginTop: "4px",
                  textAlign: "center",
                  borderRadius: "4px"
                }}
              >
                Show me how
              </div>
            </div>
          </div>
        </ActionTooltip>
      </StickyPopper>
    );
  }

  render() {
    const { adapter, settings, currentCaptionToRender, isOn, videoId } = this.props;
    return (
      <Fragment>
        { this.renderMaterial() }
        { this.state.actionTooltopOpen && this.renderActionTooltip()}
      </Fragment>
    );
  }
}

export default SettingControls;
