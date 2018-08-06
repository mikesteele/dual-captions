import expect from 'expect';
import exampleFetch from './assets/youtube/fetch';
import exampleResult from './assets/youtube/result';

import '../../public/content-scripts/init';
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

// TODO - Test for not <timedtext format="3"> ?

// TODO - Test for rejecting automatic captions

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
          endTime: 7000,
          text: `I'm OK`
        }
      ]).toEqual(captions);
      done();
    })
    .catch(err => { console.log(err)});
});
