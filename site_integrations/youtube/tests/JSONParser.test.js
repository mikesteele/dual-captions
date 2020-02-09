const fs = require('fs');
const { expect } = require('chai');
const path = require('path');
const YouTubeJSONParser = require('../parsers/JSONParser');

describe('YouTubeJSONParser', () => {
  it('should correctly parse file', done => {
    const captionFile = fs.readFileSync(path.resolve(__dirname, './assets/2-9-20.txt'));
    YouTubeJSONParser(captionFile)
      .then(captions => {
        expect(captions.length).to.equal(134);
        expect(captions[5].text).to.equal('Excuse me?');
        expect(captions[5].startTime).to.equal(38.137);
        expect(captions[5].endTime).to.equal(39.085);
        done();
      })
      .catch(err => {
        console.error(err);
      });
  });
});
