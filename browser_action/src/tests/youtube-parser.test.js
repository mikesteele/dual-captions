import expect from 'expect';
import exampleFetch from './assets/youtube/fetch';
import exampleResult from './assets/youtube/result';
import automaticCaptionsFetch from './assets/youtube/fetch-automatic-subtitles';

import '../../public/content-scripts/init/init';
import '../../public/content-scripts/init/parser';
import '../../public/content-scripts/youtube/parser';

const parser = window.DC.parser;

it('should correctly parse YouTube captions', done => {
  parser.parse(exampleFetch)
    .then(captions => {
      expect(captions).toEqual(exampleResult);
      done();
    })
    .catch(err => { console.log(err)});
});

it('should reject automatic captions', done => {
  parser.parse(automaticCaptionsFetch)
    .then()
    .catch(err => {
      expect(err).toEqual('Automatic captions are not supported.');
      done();
    });
});

it('should gracefully fail with bad XML', done => {
  parser.parse('<eee')
    .then()
    .catch(err => {
      expect(err).toEqual('Can\'t parse invalid YouTube caption file');
      done();
    });
});

it('should exclude captions that are missing time attributes', done => {
  parser.parse(`
    <?xml version="1.0" encoding="utf-8" ?>
    <timedtext format="3">
      <body>
        <p t="0" d="7000">I'm OK</p>
        <p d="1432">I'm missing t attribute</p>
        <p t="677">I'm missing d attribute</p>
        <p>I have no attributes</p>
      </body>
    </timedtext>
  `)
    .then(captions => {
      expect([
        {
          startTime: 0,
          endTime: 7,
          text: `I'm OK`
        }
      ]).toEqual(captions);
      done();
    })
    .catch(err => { console.log(err)});
});

it('should reject if no captions, even if format is OK', done => {
  parser.parse(`
    <?xml version="1.0" encoding="utf-8" ?>
    <timedtext format="3">
      <body></body>
    </timedtext>
  `)
    .then()
    .catch(err => {
      expect(err).toEqual(`Couldn't parse captions from file`);
      done();
    });
});

// I assume that <timedtext format> is how caption formats are versioned.
// Though I haven't come across a caption file that didn't have <timedtext format="3">.
// If YOU do - please feel free to open a PR, adding the caption file to tests/assets/youtube.
// Like tests/assets/youtube/fetch.js.
it(`should reject captions that aren't timedtext format='3'`, done => {
  parser.parse(`
    <?xml version="1.0" encoding="utf-8" ?>
    <timedtext format="4">
      <body>
        <p t="0" d="7000">Test caption</p>
      </body>
    </timedtext>
  `)
    .then()
    .catch(err => {
      expect(err).toEqual(`Can't parse invalid YouTube caption file`);
      done();
    });
});
