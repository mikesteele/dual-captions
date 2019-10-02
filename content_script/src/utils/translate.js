const en = require('dual-captions-browser-action/build/locales/en/translations.json');
const fr = require('dual-captions-browser-action/build/locales/fr/translations.json');
const locales = {
  en,
  fr
};

const translate = (lang, key) => {
  if (locales[lang] && locales[lang][key]) {
    return locales[lang][key];
  } else {
    return key;
  }
};

export default translate;
