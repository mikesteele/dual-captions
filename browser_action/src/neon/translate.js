const en = require('dual-captions-browser-action/public/locales/en/translations.json');
const fr = require('dual-captions-browser-action/public/locales/fr/translations.json');
const zhTw = require('dual-captions-browser-action/public/locales/zh-tw/translations.json');

const locales = {
  en,
  fr,
  'zh-tw': zhTw
};

// If no translation available, fall back to English
const FALLBACK_LANG = 'en';

const translate = (lang, key) => {
  if (locales[lang] && locales[lang][key]) {
    return locales[lang][key];
  } else if (locales[FALLBACK_LANG] && locales[FALLBACK_LANG][key]) {
    return locales[FALLBACK_LANG][key];
  } else {
    return key;
  }
};

export default translate;
