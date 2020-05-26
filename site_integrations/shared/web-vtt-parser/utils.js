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

module.exports = {
  timeStringToSeconds
};
