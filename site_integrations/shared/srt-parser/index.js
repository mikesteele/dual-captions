const fixCaptionFile = captionFile => {
  // Trim each line
  const trimmedFile = captionFile.split('\n').map(line => line.trim()).join('\n').trim();
  // Remove any extra lines, while making sure the last chunk has two new lines
  const fixedFile = `${trimmedFile}\n\n`;
  return fixedFile;
};

const SrtParser = captionFile => {
  return new Promise((resolve, reject) => {
    const fixedFile = fixCaptionFile(captionFile);
    const chunks = fixedFile.split('\n\n');
    const captions = [];
    chunks.forEach(chunk => {
      const lines = chunk.split('\n');
      if (lines.length > 1) {
        const times = lines[1];
        const textLines = lines.slice(2);
        const text = textLines.join('\n');
        if (times.includes('-->')) {
          const [
            startTimeString,
            endTimeString
          ] = times.split('-->');
          const startTime = timeStringToSeconds(startTimeString);
          const endTime = timeStringToSeconds(endTimeString);
          if (startTime && endTime) {
            captions.push({
              startTime,
              endTime,
              text
            });
          } else {
            reject(`SrtParser - Couldn't parse times`);
          }
        } else {
          reject('SrtParser - Expected times to include "-->"');
        }
      }
    });
    resolve(captions);
  });
};

const MS_IN_ONE_SECOND = 1000;
const MS_IN_ONE_MINUTE = 60 * MS_IN_ONE_SECOND;
const MS_IN_ONE_HOUR = 60 * MS_IN_ONE_MINUTE;

// Ex. HH:MM:SS,mss
const timeStringToSeconds = timeString => {
  const pattern = /(\d+):(\d+):(\d+),(\d+)/g;
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

module.exports = SrtParser;
