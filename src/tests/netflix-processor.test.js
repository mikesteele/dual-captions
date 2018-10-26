import expect from 'expect';
import sinon from 'sinon';
const fs = require('fs');
const path = require('path');

const exampleFetch = fs.readFileSync(path.resolve(__dirname, './assets/netflix/fetch-en-cc.txt'));

let detectedLanguage = 'en';
window.DC.translate = sinon.stub().returns(
  Promise.resolve({
    text: 'Used Google Translate',
    from: {
      language: {
        iso: detectedLanguage
      }
    }
  })
);

sinon.stub(window, 'fetch')
  .returns(
    Promise.resolve({
      ok: true,
      text: () => {
        return Promise.resolve(exampleFetch)
      }
    })
  );

import './chrome-mock';
import '../../public/content-scripts/init/init';
import '../../public/content-scripts/init/adapter';
import '../../public/content-scripts/netflix/adapter';
import '../../public/content-scripts/init/parser';
import '../../public/content-scripts/netflix/parser';
import '../../public/content-scripts/init/provider';
import '../../public/content-scripts/netflix/processor';

const adapter = window.DC.adapter;
const parser = window.DC.parser;
const provider = window.DC.provider;
const processor = window.DC.processor;

sinon.stub(adapter, 'getVideoId').returns('test-video-id');

it('should fetch, parse, guess language, and load captions on Netflix caption request', done => {
  // Spies
  sinon.spy(processor, 'fetchUrl');
  sinon.spy(parser, 'parse');
  sinon.spy(processor, '_guessLanguageOfCaptions');
  sinon.spy(provider, '__loadCaptions');

  const testCaptionUrl = 'some-netflix-caption-url';
  processor._onMessage({
    type: 'process-netflix-caption-request',
    payload: testCaptionUrl
  }, null, response => {
    expect(response).toEqual({ ok: true });
    expect(processor.fetchUrl.called).toEqual(true);
    expect(parser.parse.called).toEqual(true);
    expect(processor._guessLanguageOfCaptions.called).toEqual(true);
    expect(provider.__loadCaptions.called).toEqual(true);

    // Clean up
    processor.fetchUrl.restore();
    parser.parse.restore();
    processor._guessLanguageOfCaptions.restore();
    provider.__loadCaptions.restore();

    done();
  });
});

// _guessLanguageOfCaptions tests - TODO

it('should correctly _guessLanguageOfCaptions', done => {
  // FIXME: Use actual captions from tests/assets/netflix
  const captionsToGuess = [
    {
      startTime: 10,
      endTime: 7000,
      text: 'Météo'
    }, {
      startTime: 9000,
      endTime: 12000,
      text: 'Il fait beau aujourd\'hui.'
    }, {
      startTime: 15000,
      endTime: 19000,
      text: 'Il va pleuvoir ce week-end.'
    }, {
      startTime: 20000,
      endTime: 23000,
      text: 'La semaine prochaine...'
    }
  ];

  // Stubs
  sinon.stub(processor, '_guessLanguage').returns(Promise.resolve('fr'));

  processor._guessLanguageOfCaptions(captionsToGuess)
    .then(result => {
      const { captions, language } = result;
      expect(language).toEqual('fr');
      // TODO - expect processor._guessLanguage called multiple times
      // TODO - expect processor._guessLanguage called for median caption

      // Clean up
      processor._guessLanguage.restore();
      done();
    })

});


// _guessLanguage tests - TODO
