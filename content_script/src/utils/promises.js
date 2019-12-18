import _get from 'lodash/get';
import _set from 'lodash/set';

class GoogleCloudTranslateAPI {
  constructor() {
    // Schema: {
    //   toLang: {
    //     fromLang: {
    //       text: result
    //     }
    //   }
    // }
    this.translations = {};
    // Schema: {
    //   toLang: {
    //     fromLang: {
    //       text: [callback]
    //     }
    //   }
    // }
    this.translationCallbacks = {};
    this.translate = this.translate.bind(this);
  }

  translate(text, toLang, fromLang) {
    return new Promise((resolve, reject) => {
      if (_get(this.translations, [toLang, fromLang, text])) {
        resolve(_get(this.translations, [toLang, fromLang, text]));
      } else {
        this.doTranslate(text, toLang, fromLang).then(result => {
          _set(this.translations, [toLang, fromLang, text], result);
          resolve(result);
        });
      }
    });
  }

  doTranslate(text, toLang, fromLang) {
    return new Promise((resolve, reject) => {
      if (_get(this.translationCallbacks, [toLang, fromLang, text])) {
        const callbacks = [..._get(this.translationCallbacks, [toLang, fromLang, text]), resolve];
        _set(this.translationCallbacks, [toLang, fromLang, text], callbacks);
      } else {
        _set(this.translationCallbacks, [toLang, fromLang, text], []);
        google.translate(text, toLang, fromLang).then(result => {
          this.translationCallbacks[toLang][fromLang][text].forEach(cb => cb(result));
          resolve(result);
        }).catch(() => {
          this.translationCallbacks[toLang][fromLang][text].forEach(cb => cb('Error'));
          resolve('Error');
        });
      }
    });
  }
}
