import expect from 'expect';
import sinon from 'sinon';

import '../../public/content-scripts/init';
// Create adapter
import '../../public/content-scripts/config/init';
import '../../public/content-scripts/config/youtube';
// Creater fetcher
import '../../public/content-scripts/init/fetcher';
import '../../public/content-scripts/youtube/fetcher';
// Create parser
import '../../public/content-scripts/init/parser';
import '../../public/content-scripts/youtube/parser';

import '../../public/content-scripts/init/provider';

/**

FIXME
- Times of example captions should reflect actual caption times
- Tests should test the buffer room that caption times are given

**/

window.DC.translate = sinon.stub().returns(Promise.resolve({
  text: 'Used Google Translate'
}));

const provider = window.DC.provider;

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
  window.DC.translate.resetHistory();
});

it('findNearestCaption should correctly find nearest caption', () => {
  const captions = exampleEnglishCaptions;
  expect(provider.findNearestCaption(captions, 10).text).toEqual('Weather Report');
  expect(provider.findNearestCaption(captions, 9000).text).toEqual('The weather for today is in the high 80s.');
  expect(provider.findNearestCaption(captions, 15000).text).toEqual('It will likely rain this weekend.');
  expect(provider.findNearestCaption(captions, 80000)).toEqual(undefined);
});

it('should use captions if language is loaded', done => {
  provider.__loadCaptions(exampleEnglishCaptions, 'en');
  provider.translate('Test', 'en', 10, true)
    .then(translation => {
      expect(translation).toEqual({
        text: 'Weather Report ✓'
      });
      done();
    })
    .catch(err => { console.log(err)});
});

it('should use Google Translate no languages are loaded', done => {
  provider.translate('Test', 'en', 500, true)
    .then(translation => {
      expect(translation).toEqual({
        text: 'Used Google Translate'
      });
      done();
    })
    .catch(err => { console.log(err)});
});

it('should use Google Translate if selected language is not loaded', done => {
  provider.__loadCaptions(exampleFrenchCaptions, 'fr');
  provider.translate('Test', 'en', 500, true)
    .then(translation => {
      expect(translation).toEqual({
        text: 'Used Google Translate'
      });
      done();
    })
    .catch(err => { console.log(err)});
});

it('should use Google Translate if current time is undefined', done => {
  provider.__loadCaptions(exampleFrenchCaptions, 'fr');
  provider.translate('Test', 'fr', undefined, true)
    .then(translation => {
      expect(translation).toEqual({
        text: 'Used Google Translate'
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
        text: 'Météo ✓'
      });
      done();
    })
    .catch(err => { console.log(err)});
});

it('should use Google Translate if not useCaptionsFromVideo', done => {
  provider.__loadCaptions(exampleFrenchCaptions, 'fr');
  provider.translate('Test', 'fr', 10, false)
    .then(translation => {
      expect(translation).toEqual({
        text: 'Used Google Translate'
      });
      done();
    })
    .catch(err => { console.log(err)});
});
