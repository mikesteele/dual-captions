import Parser from '../../Parser';
const fs = require('fs');
const { expect } = require('chai');
const path = require('path');

const currentSite = 'netflix';

const makeParser = (callback) => {
  Parser({
    children: parser => callback(parser)
  });
};

const blurRadius = 0.2; // TODO - Needs additional testing

// This will live in <Provider> and be called automatically if:
// 1. We know the player's firstCaptionLanguage (see https://github.com/mikesteele/dual-captions/commit/b64dd478cd2891f141d468907c6dd9b9aec2698c)
// 2. We've loaded captions for the firstCaptionLanguage
// 3. We've loaded captions for the secondCaptionLanguage
const optimizeCaptions = (firstCaptions, secondCaptions, blurRadius) => {
  const [ optimzedCaptions, work ] = optimizeCaptionsHelper(firstCaptions, secondCaptions, blurRadius);
  const isValid = checkOptimizationWork(work);
  if (isValid) {
    return optimizedCaptions;
  } else {
    throw new Error('Could not optimize captions');
  };
};

const optimizeCaptionsHelper = (firstCaptions, secondCaptions, blurRadius) => {
  const work = [];
  secondCaptions.forEach(caption => {
    eagerlyMerge()
    findNearestCaption()
    fuzz()
  });
  return [ optimizedCaptions, work ];
};

const checkOptimizationWork = (workDone) => {
  workDone.forEach(work => {
    isInDescendingOrder()
    areFuzzesUnique()
  });
}

const enCaptionFile = fs.readFileSync(path.resolve(__dirname, '../assets/netflix/optimized-captions/homes-en-cc.txt'));
const frCaptionFile = fs.readFileSync(path.resolve(__dirname, '../assets/netflix/optimized-captions/homes-fr.txt'));

describe('optimized captions', () => {
  it('should merge captions', done => {
    makeParser(parser => {
      const enCaptionFilePromise = parser.parse(enCaptionFile, currentSite);
      const frCaptionFilePromise = parser.parse(frCaptionFile, currentSite);
      Promise.all([ enCaptionFilePromise, frCaptionFilePromise ])
        .then(results => {
          const [ enCaptions, frCaptions ] = results;
          // Sanity tests
          expect(enCaptions[75].text).to.equal('When the heavens open,');
          expect(enCaptions[76].text).to.equal('up to a meterÂ of rain\ncan fall in a single day,');
          expect(frCaptions[74].text).to.equal('Quand le ciel se couvre, il peut pleuvoir\njusqu\'Ã  un mÃ¨tre d\'eau en une journÃ©e,');

          // const optimizedEsCaptions = optimizeCaptions(enCaptions, frCaptions, blurRadius);

          expect(true, JSON.stringify([
            enCaptions[75],
            enCaptions[76],
            frCaptions[74]
          ])).to.be.false;

          // TODO
          done();
        });
    });
  });
});
