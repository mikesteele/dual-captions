const SrtParser = require('../index');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const SRT_FILE = `
1
00:02:17,440 --> 00:02:20,375
Senator, we're making
our final approach into Coruscant.
Hooray!

2
00:02:20,476 --> 00:02:22,501
Very good, Lieutenant.

`;

const SRT_CAPTIONS = [{
  text: `Senator, we're making\nour final approach into Coruscant.\nHooray!`,
  startTime: (2 * MINUTE + 17 * SECOND + 440) / 1000,
  endTime: (2 * MINUTE + 20 * SECOND + 375) / 1000
}, {
  text: 'Very good, Lieutenant.',
  startTime: (2 * MINUTE + 20 * SECOND + 476) / 1000,
  endTime: (2 * MINUTE + 22 * SECOND + 501) / 1000
}];

describe('SrtParser', () => {
  it('should work', done => {
    SrtParser(SRT_FILE)
      .then(captions => {
        expect(captions[0].text).to.equal(SRT_CAPTIONS[0].text);
        expect(captions[0].startTime).to.equal(SRT_CAPTIONS[0].startTime);
        expect(captions[0].endTime).to.equal(SRT_CAPTIONS[0].endTime);
        expect(captions[1].text).to.equal(SRT_CAPTIONS[1].text);
        expect(captions[1].startTime).to.equal(SRT_CAPTIONS[1].startTime);
        expect(captions[1].endTime).to.equal(SRT_CAPTIONS[1].endTime);
        done();
      })
      .catch(err =>  console.log(err));
  });
  it('should handle whitespace in chunk breaks', done => {
    const SRT_FILE_WITH_WHITESPACE = [
      '1',
      '00:02:17,440 --> 00:02:20,375',
      'Senator, we\'re making',
      'our final approach into Coruscant.',
      'Hooray!',
      '               ',
      '2',
      '00:02:20,476 --> 00:02:22,501',
      'Very good, Lieutenant.',
      '    '
    ].join('\n');
    SrtParser(SRT_FILE_WITH_WHITESPACE)
      .then(captions => {
        expect(captions[0].text).to.equal(SRT_CAPTIONS[0].text);
        expect(captions[0].startTime).to.equal(SRT_CAPTIONS[0].startTime);
        expect(captions[0].endTime).to.equal(SRT_CAPTIONS[0].endTime);
        expect(captions[1].text).to.equal(SRT_CAPTIONS[1].text);
        expect(captions[1].startTime).to.equal(SRT_CAPTIONS[1].startTime);
        expect(captions[1].endTime).to.equal(SRT_CAPTIONS[1].endTime);
        done();
      })
      .catch(err =>  console.log(err));
  });
  it('should work for startTime of 0', done => {
    const captionFile = fs.readFileSync(path.resolve(__dirname, './assets/zh.txt'), 'utf8');
    SrtParser(captionFile)
      .then(captions => {
        expect(captions[0].startTime).to.equal(0);
        done();
      })
      .catch(err => console.log(err));
  });
});
