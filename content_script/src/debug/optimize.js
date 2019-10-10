// Top value: 1
const BUFFER = 0.5;

const adjustTimes = (firstCaptions, secondCaptions) => {
  const s = firstCaptions.map(c => {
    if (c.hasMatch) {
      c.startTime = secondCaptions[c.matchIndex].startTime;
      c.endTime = secondCaptions[c.matchIndex].endTime;
      c.adjusted = true;
    }
    return c;
  });
  return s;
}

const areAllUnique = arr => {
  let result = true;
  const keys = {};
  arr.forEach(v => {
    if (keys[v]) {
      result = false;
    } else {
      keys[v] = 1;
    }
  });
  return result;
};

const findMatch = (caption, captions) => {
  const index = captions.findIndex(c => {
    return (
      Math.abs(c.startTime - caption.startTime) <= BUFFER &&
      Math.abs(c.endTime - caption.endTime) <= BUFFER
    );
  });
  if (index > -1) {
    return {
      hasMatch: true,
      index: index
    };
  } else {
    return {
      hasMatch: false
    };
  }
}

// Returns optimized secondCaptions
const optimize = (firstCaptions, secondCaptions) => {
  let s = secondCaptions.map(c => {
    const { hasMatch, index } = findMatch(c, firstCaptions);
    const result = {...c, hasMatch};
    if (hasMatch) {
      result.matchIndex = index;
    }
    return result;
  });
  const matchIndexes = s.filter(i => i.hasMatch).map(i => i.matchIndex);
  if (areAllUnique(matchIndexes)) {
    s = adjustTimes(s, firstCaptions);
  }
  return s;
}

export default optimize;
