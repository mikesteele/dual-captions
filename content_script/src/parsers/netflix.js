const parse = (captionFile) => {
  return new Promise((resolve, reject) => {
    const captions = [];
    const domParser = new DOMParser();  // TODO - Move to class instance
    const xml = domParser.parseFromString(captionFile, 'text/xml');
    const tt = xml.querySelector('tt');
    let tickRate;
    if (tt) {
      tickRate = tt.getAttribute('ttp:tickRate');
    }
    const body = xml.querySelector('body');
    const captionsContainer = body.firstElementChild;
    if (body && captionsContainer && tickRate) {
      for (let i = 0; i < captionsContainer.children.length; i++) {
        const currentChild = captionsContainer.children[i];
        if (currentChild.tagName === 'p') {
          const begin = currentChild.getAttribute('begin');
          const end = currentChild.getAttribute('end');
          if (begin && end) {
            // Netflix uses the tick rate defined in <tt ttp:tickRate/>
            // to time the captions. Ex. '10000t' === 10000 / tickRate
            const tickRatePattern = /(\d+)t/;
            if (tickRatePattern.test(begin) && tickRatePattern.test(end)) {
              let startTime = tickRatePattern.exec(begin)[1];
              let endTime = tickRatePattern.exec(end)[1];
              startTime = startTime / tickRate;
              endTime = endTime / tickRate;
              let captionText = currentChild.textContent;
              if (currentChild.childNodes.length > 1) {
                /**
                 *  Netflix can use a <br/> inside of captions to insert a break.
                 */
                captionText = '';
                for (let j = 0; j < currentChild.childNodes.length; j++) {
                  const child = currentChild.childNodes[j]; // TODO - Rename
                  if (child.tagName === 'br') {
                    captionText = captionText + '\n';
                  } else {
                    captionText = captionText + child.textContent;
                  }
                }
              }
              /**
              For some videos, Netflix stores a caption as two (or more?) seperate elements in the caption XML.
              For example:
              +---------------------+
              | Hello! How have you |
              |    been lately?     |
              +---------------------+
              Could look like this in the XML:
              <p begin="100t" end="200t">Hello! How have you</p>
              <p begin="100t" end="200t">been lately?</p>
              Note that the two elements will have the same `begin` and `end` times though,
              so here we concatenate the new caption with the last caption if they have the same times.
              **/
              if (captions.length
                  && captions[captions.length - 1]
                  && captions[captions.length - 1].startTime === startTime
                  && captions[captions.length - 1].endTime   === endTime) {
                const lastCaption = captions[captions.length - 1];
                lastCaption.text = `${lastCaption.text}\n${captionText}`;
              } else {
                captions.push({
                  startTime: startTime,
                  endTime: endTime,
                  text: captionText
                });
              }
            } else {
              reject('Unable to use captions, begin or end attribute is unable to be converted.');
              return;
            }
          } else {
            reject('Unable to use captions, missing begin or end attributes.');
            return;
          }
        }
      }
      if (captions.length) {
        resolve(captions);
      } else {
        reject(`Couldn't parse captions from file`);
      }
    } else {
      reject(`Can't parse invalid Netfix caption file`);
    }
  });
};

export default { parse };
