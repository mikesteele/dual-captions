import expect from 'expect';
import sinon from 'sinon';
import assert from 'assert';

import '../../public/content-scripts/init/init';
// Create adapter
import '../../public/content-scripts/init/adapter';
import '../../public/content-scripts/youtube/adapter';
// Creater fetcher
import '../../public/content-scripts/init/fetcher';
import '../../public/content-scripts/youtube/fetcher';
// Create parser
import '../../public/content-scripts/init/parser';
import '../../public/content-scripts/youtube/parser';
// Create provider
import '../../public/content-scripts/init/provider';

/**

FIXME
- Times of example captions should reflect actual caption times
- Tests should test the buffer room that caption times are given

**/

const provider = window.DC.provider;
const fetcher = window.DC.fetcher;
const parser = window.DC.parser;
const adapter = window.DC.adapter;

const adapterStub = sinon.stub(adapter, 'getVideoId');
adapterStub.returns('test-video-id');

const exampleEnglishCaptions = [
  {
    startTime: 10,
    endTime: 7000,
    text: 'Weather Report'
  }, {
    startTime: 9000,
    endTime: 12000,
    text: 'The weather for today is in the high 80s.'
  }, {
    startTime: 15000,
    endTime: 19000,
    text: 'It will likely rain this weekend.'
  }
];

const exampleFrenchCaptions = [
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
  }
];

beforeEach(() => {
  provider.__captions = {};
});

it('findCaption should correctly find caption within a time range', () => {
  const captions = exampleEnglishCaptions;
  expect(provider.findCaption(captions, 15, false).text).toEqual('Weather Report');
  expect(provider.findCaption(captions, 1000, false).text).toEqual('Weather Report');
  expect(provider.findCaption(captions, 10000, false).text).toEqual('The weather for today is in the high 80s.');
  expect(provider.findCaption(captions, 16000, false).text).toEqual('It will likely rain this weekend.');
  expect(provider.findCaption(captions, 80000, false)).toEqual(undefined);
});

it('findCaption should correctly find caption with the closest startTime if captionsMayNotMatchUp', () => {
  const captions = exampleEnglishCaptions;
  expect(provider.findCaption(captions, 10, true).text).toEqual('Weather Report');
  expect(provider.findCaption(captions, 9000, true).text).toEqual('The weather for today is in the high 80s.');
  expect(provider.findCaption(captions, 15000, true).text).toEqual('It will likely rain this weekend.');
  expect(provider.findCaption(captions, 80000, true)).toEqual(undefined);
});

it('should use captions if language is loaded', done => {
  provider.__loadCaptions(exampleEnglishCaptions, 'en');
  provider.translate('Test', 'en', 10, true)
    .then(translation => {
      expect(translation).toEqual({
        text: 'Weather Report'
      });
      done();
    })
    .catch(err => { console.log(err)});
});

it('should support loading two languages', done => {
  provider.__loadCaptions(exampleEnglishCaptions, 'en');
  provider.__loadCaptions(exampleFrenchCaptions, 'fr');
  provider.translate('Test', 'fr', 10, true)
    .then(translation => {
      expect(translation).toEqual({
        text: 'Météo'
      });
      done();
    })
    .catch(err => { console.log(err)});
});

it('should handle switching between videos - requestLanguage', done => {
  const fetchStub = sinon.stub(fetcher, 'fetchCaptions');
  const parseStub = sinon.stub(parser, 'parse');

  fetchStub.returns(Promise.resolve());
  parseStub.returns(Promise.resolve([]));
  adapterStub.returns('test-video-id-1');

  provider.requestLanguage('en')
    .then(() => {
      expect(fetcher.fetchCaptions.calledWith('en', 'test-video-id-1'));
      adapterStub.reset();
      adapterStub.returns('test-video-id-2');
      provider.requestLanguage('fr')
        .then(() => {
          expect(fetcher.fetchCaptions.calledWith('fr', 'test-video-id-2'));
          done();
          fetchStub.restore();
          parseStub.restore();
        })
        .catch(err => {
          fetchStub.restore();
          parseStub.restore();
          console.log(err);
        });
    })
    .catch(err => {
      fetchStub.restore();
      parseStub.restore();
      console.log(err);
    });
});

it('should handle switching between videos - translate', done => {
  // Let's load captions for two videos
  adapterStub.returns('test-video-id-1');
  provider.__loadCaptions([{
    "startTime": 1234,
    "endTime": 1600,
    "text": "This is a caption from video 1"
  }], 'en');
  adapterStub.returns('test-video-id-2');
  provider.__loadCaptions([{
    "startTime": 1234,
    "endTime": 1600,
    "text": "This is a caption from video 2"
  }], 'en');
  adapterStub.returns('test-video-id-1');
  provider.translate('Test caption', 'en', 1234, true)
    .then(response1 => {
      expect(response1.text === 'This is a caption from video 1').toEqual(true);
      adapterStub.returns('test-video-id-2');
      provider.translate('Test caption', 'en', 1234, true)
        .then(response2 => {
          expect(response2.text === 'This is a caption from video 2').toEqual(true);
          done();
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

it('should not load captions if missing videoId', done => {
  const originalLoadedCaptions = {...provider.__captions};
  adapterStub.returns(undefined);
  provider.__loadCaptions([{
    "startTime": 1234,
    "endTime": 1600,
    "text": "Test caption"
  }], 'en')
    .then(() => {})
    .catch(err => {
      expect(err === `Can't load captions, missing videoId or currentSite`).toEqual(true);
      assert.deepEqual(provider.__captions, originalLoadedCaptions);
      done();
    });
});

it('should not load captions if missing currentSite', done => {
  const originalLoadedCaptions = {...provider.__captions};
  adapterStub.returns('test-video-id-1');
  adapter.site = undefined;
  provider.__loadCaptions([{
    "startTime": 1234,
    "endTime": 1600,
    "text": "Test caption"
  }], 'en')
    .then(() => {})
    .catch(err => {
      expect(err === `Can't load captions, missing videoId or currentSite`).toEqual(true);
      assert.deepEqual(provider.__captions, originalLoadedCaptions);
      adapter.site = 'youtube';
      done();
    });
});

it('should handle switching between videos - loadCaptions', () => {
  // Let's load captions for two videos
  adapterStub.returns('test-video-id-1');
  provider.__loadCaptions([{
    "startTime": 1234,
    "endTime": 1600,
    "text": "This is a caption from video 1"
  }], 'en');
  adapterStub.returns('test-video-id-2');
  provider.__loadCaptions([{
    "startTime": 1234,
    "endTime": 1600,
    "text": "This is a caption from video 2"
  }], 'en');
  assert.deepEqual(provider.__captions, {
    'youtube': {
      'test-video-id-1': {
        'en': [{
          "startTime": 1234,
          "endTime": 1600,
          "text": "This is a caption from video 1"
        }]
      },
      'test-video-id-2': {
        'en': [{
          "startTime": 1234,
          "endTime": 1600,
          "text": "This is a caption from video 2"
        }]
      }
    }
  })
});

it('getLoadedLanguages() should return [] if no languages are loaded', () => {
  adapterStub.returns(null);
  const loadedLanguages1 = provider.getLoadedLanguages();
  expect(loadedLanguages1).toEqual([]);
  adapterStub.returns('test-video-id-1');
  const loadedLanguages2 = provider.getLoadedLanguages();
  expect(loadedLanguages2).toEqual([]);
});

it('should correctly getLoadedLanguages() if languages are loaded', () => {
  adapterStub.returns('test-video-id-1');
  provider.__loadCaptions([{
    "startTime": 1234,
    "endTime": 1600,
    "text": "This is a caption from video 1"
  }], 'en');
  provider.__loadCaptions([{
    "startTime": 1234,
    "endTime": 1600,
    "text": "C'est un caption du 1e video"
  }], 'fr');
  const loadedLanguages = provider.getLoadedLanguages();
  expect(loadedLanguages).toEqual(['en', 'fr']);
});
