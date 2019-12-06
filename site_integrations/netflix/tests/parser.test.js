const fs = require('fs');
const { expect } = require('chai');
const path = require('path');
const NetflixParser = require('../parser');

const parser = NetflixParser;

describe('Netflix parser', () => {
  it('should correctly parse - embedded <br>s', done => {
    const captionFile = fs.readFileSync(path.resolve(__dirname, './assets/caption-file-with-embedded-brs.txt'));
    parser(captionFile)
      .then(result => {
        expect(result[0].text, 'should handle <span>').to.equal(`Sorry, you must...`);
        expect(result[2].text, 'should handle embedded <br/>s').to.equal(`That was lame, right? I'm sitting here\nin a hospital bed and all...`);
        done();
      })
      .catch(err => { console.error(err) });
  });
});
