const SrtEncoder = captions => {
  return new Promise((resolve, reject) => {
    let srtFile = '\n';
    captions.forEach((caption, index) => {
      srtFile = srtFile + `${index + 1}\n`;
      srtFile = srtFile + `${secondsToSrtTime(caption.startTime)} --> ${secondsToSrtTime(caption.endTime)}\n`;
      srtFile = srtFile + `${caption.text}\n\n`;
    });
    resolve(srtFile);
  });
};

const MS_IN_ONE_SECOND = 1000;
const MS_IN_ONE_MINUTE = 60 * MS_IN_ONE_SECOND;
const MS_IN_ONE_HOUR = 60 * MS_IN_ONE_MINUTE;


// Ex. formatNum(9, 2) => '09'
// Ex. formatNum(1, 3) => '001'
const formatNum = (num, spaces) => {
  if (spaces === 2) {
    if (num > 10) {
      return `${num}`;
    } else {
      return `0${num}`;
    }
  } else if (spaces === 3) {
    if (num > 100) {
      return `${num}`;
    } else if (num > 10){
      return `0${num}`;
    } else {
      return `00${num}`;
    }
  } else {
    throw new Error('SrtEncoder - formatNum only can handle spaces of 2 or 3');
  }
}

// HH:MM:SS,MIL
const secondsToSrtTime = s => {
  s = s * 1000; // Convert s to milliseconds
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let milliseconds = 0;
  if (s >= MS_IN_ONE_HOUR) {
    hours = Math.floor(s / MS_IN_ONE_HOUR);
    s = s - hours * MS_IN_ONE_HOUR;
  }
  if (s >= MS_IN_ONE_MINUTE) {
    minutes = Math.floor(s / MS_IN_ONE_MINUTE);
    s = s - minutes * MS_IN_ONE_MINUTE;
  }
  if (s >= MS_IN_ONE_SECOND) {
    seconds = Math.floor(s / MS_IN_ONE_SECOND);
    s = s - seconds * MS_IN_ONE_SECOND;
  }
  milliseconds = Math.floor(s);
  return `${formatNum(hours, 2)}:${formatNum(minutes, 2)}:${formatNum(seconds, 2)},${formatNum(milliseconds, 3)}`;
}

module.exports = SrtEncoder;
