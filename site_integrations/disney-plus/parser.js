const timeStringToSeconds = require('../shared/web-vtt-parser/utils').timeStringToSeconds;

// Ex. "<i>Hey!</i>" => "Hey!"
const stripOutHTML = (str) => {
  const el = document.createElement('div');
  el.innerHTML = str;
  return el.textContent;
}

const DisneyPlusParser = (captionFile) => {
  return new Promise((resolve, reject) => {
    const fixedFile = `${captionFile.trim()}\n`;
    const lines = fixedFile.split('\n');
    if (!lines[0].includes('WEBVTT')) {
      reject('DisneyPlusParser - Expected first line to include WEBVTT');
    }

    // Skip STYLE declarations, see example in tests/parser.test.js
    let lineIndex = 1;
    while (!lines[lineIndex].includes('-->') && lineIndex < lines.length - 1) {
      lineIndex++;
    }

    const captions = [];
    let currentStartTime = null;
    let currentEndTime = null;
    let currentText = [];
    while (lineIndex <= lines.length - 1) {
      const currentLine = lines[lineIndex];
      if (currentLine.includes('-->')) {
        const [
          startTimeString,
          endTimeString
        ] = currentLine.split('-->');
        const startTime = timeStringToSeconds(startTimeString);
        const endTime = timeStringToSeconds(endTimeString);
        if (startTime && endTime) {
          currentStartTime = startTime;
          currentEndTime = endTime;
        } else {
          reject(`DisneyPlusParser - Couldn't parse times`);
        }
      } else if (currentLine.trim() !== '') {
        currentText.push(stripOutHTML(currentLine));
      } else if (currentLine.trim() === '') {
        if (currentText.length > 0 &&
            currentEndTime !== null &&
            currentStartTime !== null) {
          captions.push({
            startTime: currentStartTime,
            endTime: currentEndTime,
            text: currentText.join('\n')
          });
          currentStartTime = null;
          currentEndTime = null;
          currentText = [];
        }
      }
      lineIndex++;
    }
    resolve(captions);
  });
};

module.exports = DisneyPlusParser;
