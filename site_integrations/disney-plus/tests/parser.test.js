const { expect } = require('chai');
const DisneyPlusParser = require('../parser');

const EXAMPLE_FILE = `

WEBVTT

STYLE
::cue() {
  font-family: Arial;
}

00:15:13.360 --> 00:15:15.920 line:90%,end
Hey!
I'm Mike

00:15:23.560 --> 00:15:25.120 line:90%,end
How are you?

`;

const parser = DisneyPlusParser;

describe('Disney+ parser', () => {
  it('should correctly parse', done => {
    parser(EXAMPLE_FILE)
      .then(result => {
        expect(result[0].startTime, 'should get correct startTime').to.equal(913.36);
        expect(result[0].endTime, 'should get correct endTime').to.equal(915.92);
        expect(result[0].text, 'should get correct text').to.equal("Hey!\nI'm Mike");
        expect(result.length, 'should parse out correct number of captions').to.equal(2);
        done();
      })
      .catch(err => { console.error(err) });
  });
});
