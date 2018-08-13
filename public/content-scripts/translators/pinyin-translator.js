class PinyinTranslator extends Translator {
  translate(text, language) {
    const result = window.DC.pinyin(text);
    // Ex. [[ 'zhōng' ], [ 'xīn' ]]

    const pinyinString = result.map(item => item[0]).join(' ');
    return Promise.resolve({
      text: pinyinString
    });
  }
}

window.DC.PinyinTranslator = new PinyinTranslator();
