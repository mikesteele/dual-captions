const fs = require('fs');
const { expect } = require('chai');
const path = require('path');
const WebVttParser = require('../index');

const parser = WebVttParser;

describe('WebVtt parser', () => {
  it('should correctly parse', done => {
    const captionFile = fs.readFileSync(path.resolve(__dirname, './assets/kanopy-vtt.txt'), 'utf8');
    parser(captionFile)
      .then(result => {
        expect(result[13].startTime, 'should get correct startTime').to.equal(302.32);
        expect(result[13].endTime, 'should get correct endTime').to.equal(303.992);
        expect(result[13].text, 'should get correct text').to.equal('You going?');
        done();
      })
      .catch(err => { console.error(err) });
  });
});
