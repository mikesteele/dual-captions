const chunk = require('lodash/chunk');
const timeStringToSeconds = require('./utils').timeStringToSeconds;

const WebVttParser = captionFile => {
  return new Promise((resolve, reject) => {
    // Remove any extra lines, while making sure the last chunk has a new line
    const fixedFile = `${captionFile.trim()}\n`;
    const lines = fixedFile.split('\n');
    if (!lines[0].includes('WEBVTT')) {
      reject('VttParser - Expected first line to include WEBVTT');
    }
    if (!lines[1].includes('X-TIMESTAMP-MAP')) {
      reject('VttParser - Expected second line to include X-TIMESTAMP-MAP');
    }
    if (lines[2] !== '') {
      reject('VttParser - Expected third line to be empty');
    }
    const body = lines.slice(3, lines.length);
    if (body.length % 4 !== 0) {
      reject('VttParser - Expected body to be divisible by 4');
    }
    const chunks = chunk(body, 4);
    const captions = chunks.map(chunk => {
      const times = chunk[1];
      if (times.includes('-->')) {
        const [
          startTimeString,
          endTimeString
        ] = times.split('-->');
        const startTime = timeStringToSeconds(startTimeString);
        const endTime = timeStringToSeconds(endTimeString);
        if (startTime && endTime) {
          return {
            startTime,
            endTime,
            text: chunk[2]
          }
        } else {
          reject(`VttParser - Couldn't parse times`);
        }
      } else {
        reject('VttParser - Expected times to include "-->"');
      }
    });
    resolve(captions);
  });
};

module.exports = WebVttParser;
