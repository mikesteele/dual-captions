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
const processor = window.DC.processor;

sinon.stub(adapter, 'getVideoId').returns('test-video-id');

// _onMessage tests - TODO

it('should fetch, parse, guess language, and load captions on Netflix caption request', done => {
  const testCaptionUrl = 'some-netflix-caption-url';
  processor._onMessage({
    type: 'process-netflix-caption-request',
    payload: testCaptionUrl
  }, null, response => {
    expect(response).toEqual({ ok: true });
    done();
  });
});

// fetchUrl tests - TODO

// _guessLanguageOfCaptions tests - TODO

// _guessLanguage tests - TODO
