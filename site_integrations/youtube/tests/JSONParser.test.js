const fs = require('fs');
const { expect } = require('chai');
const path = require('path');
const YouTubeJSONParser = require('../parsers/JSONParser');

describe('YouTubeJSONParser', () => {
  it('should correctly parse file', () => {
    const captionFile = fs.readFileSync(path.resolve(__dirname, './assets/2-9-20.txt'));
    YouTubeJSONParser(captionFile)
      .then(captions => {
        console.error(captions);
      })
      .catch(err => {
        console.error(err);
      })
  });
});
