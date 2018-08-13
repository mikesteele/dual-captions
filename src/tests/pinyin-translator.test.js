import expect from 'expect';

import '../../public/content-scripts/init';
// Load translator
import '../../public/content-scripts/init/translator';
// Load PinyinTranslator
import '../../public/content-scripts/translators/pinyin-translator';

// Load pinyin library
// TODO - Write thank you here & README
import '../../public/content-scripts/utils/pinyin';

const translator = window.DC.PinyinTranslator;

it('should translate Chinese text to pinyin', done => {
  translator.translate('中心').then(result => {
    expect(result.text).toEqual('zhōng xīn');
    done();
  }).catch(err => {
    console.log(err);
  })
});

it('should be OK with non-Chinese input', done => {
  translator.translate('Test input').then(result => {
    expect(result.text).toEqual('Test input');
    done();
  }).catch(err => {
    console.log(err);
  })
});

it('should be OK with undefined', done => {
  translator.translate(undefined).then(result => {
    expect(result.text).toEqual('');
    done();
  }).catch(err => {
    console.log(err);
  })
});

it('should be OK with null', done => {
  translator.translate(null).then(result => {
    expect(result.text).toEqual('');
    done();
  }).catch(err => {
    console.log(err);
  })
});
