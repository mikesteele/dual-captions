import Parser from '../../Parser';
const fs = require('fs');
const { expect } = require('chai');
const path = require('path');

const currentSite = 'netflix';

const makeParser = (callback) => {
  Parser({
    children: parser => callback(parser)
  });
}

describe('Netflix parser', () => {
  it('should correctly parse - embedded <br>s', done => {
    const captionFile = fs.readFileSync(path.resolve(__dirname, '../assets/netflix/caption-file-with-embedded-brs.txt'));
    makeParser(parser => {
      parser.parse(captionFile, currentSite)
        .then(result => {
          expect(result[0].text, 'should handle <span>').to.equal(`Sorry, you must...`);
          expect(result[2].text, 'should handle embedded <br/>s').to.equal(`That was lame, right? I'm sitting here\nin a hospital bed and all...`);
          done();
        })
        .catch(err => { console.error(err) });
    });
  });

  it('should correctly parse - side-by-side captions', done => {
    const captionFile = fs.readFileSync(path.resolve(__dirname, '../assets/netflix/caption-file-with-side-by-side-captions.txt'));
    makeParser(parser => {
      parser.parse(captionFile, currentSite)
        .then(result => {
          expect(result[0].text, 'should handle side-by-side captions').to.equal(`MALE NARRATOR:\nTwelve years ago,`);
          expect(result[13].text, 'should handle no children').to.equal(`[BABY CRYING]`);
          done();
        })
        .catch(err => { console.error(err) });
    });
  });

  it('should correctly parse - no span', done => {
    const captionFile = fs.readFileSync(path.resolve(__dirname, '../assets/netflix/caption-file-no-span-br.txt'));
    makeParser(parser => {
      parser.parse(captionFile, currentSite)
        .then(result => {
          expect(result[1].text, 'should handle no span').to.equal(`-[tires screeching]\n-[Chase] In just the last few weeks,`);
          done();
        })
        .catch(err => { console.error(err) });
    });
  });
});
