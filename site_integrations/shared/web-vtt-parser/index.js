const chunk = require('lodash/chunk');

const WebVttParser = captionFile => {
  return new Promise((resolve, reject) => {
    const lines = captionFile.split('\n');
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

const MS_IN_ONE_SECOND = 1000;
const MS_IN_ONE_MINUTE = 60 * MS_IN_ONE_SECOND;
const MS_IN_ONE_HOUR = 60 * MS_IN_ONE_MINUTE;

// Ex. HH:MM:SS.mss
const timeStringToSeconds = timeString => {
  const pattern = /(\d+):(\d+):(\d+).(\d+)/g;
  if (pattern.test(timeString)) {
    pattern.lastIndex = 0;
    const result = pattern.exec(timeString);
    const hours = Number(result[1]);
    const minutes = Number(result[2]);
    const seconds = Number(result[3]);
    const ms = Number(result[4]);
    return (hours * MS_IN_ONE_HOUR + minutes * MS_IN_ONE_MINUTE + seconds * MS_IN_ONE_SECOND + ms) / 1000;
  } else {
    return null;
  }
}

module.exports = WebVttParser;
