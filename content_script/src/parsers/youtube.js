const parse = (captionFile) => {
  return new Promise((resolve, reject) => {
    let captions = [];
    const domParser = new DOMParser(); // TODO - Move to class instance
    const xml = domParser.parseFromString(captionFile, 'text/xml');
    const body = xml.querySelector('body');
    const timedtext = xml.querySelector('timedtext');
    if (body && timedtext && timedtext.getAttribute('format') === '3') {
      for (let i = 0; i < body.children.length; i++) {
        let currentChild = body.children[i];
        if (currentChild.tagName === 'p') {
          if (currentChild.children.length) {
            /**
            Static caption files look like this:
            <p>This is the caption text</p>
            Automatic caption files look like this:
            <p>
              <s>This</s>
              <s>is</s>
              <s>the</s>
              <s>caption</s>
              <s>text</s>
            </p>
            **/
            reject('Automatic captions are not supported.');
            return;
          }
          const t = currentChild.getAttribute('t');
          const d = currentChild.getAttribute('d');
          if (t && d) {
            let tNum = parseInt(t);
            let dNum = parseInt(d);
            tNum = tNum / 1000;
            dNum = dNum / 1000;
            captions.push({
              startTime: tNum,
              endTime: tNum + dNum,
              text: currentChild.textContent
            });
          }
        }
      }
      if (captions.length) {
        resolve(captions);
      } else {
        reject(`Couldn't parse captions from file`);
      }
    } else {
      reject(`Can't parse invalid YouTube caption file`);
    }
  });
}

export default { parse };
