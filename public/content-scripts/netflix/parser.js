class NetflixTranslationParser extends TranslationParser {
  constructor() {
    super();
    this.parser = new DOMParser();
    this.parse = this.parse.bind(this);
  }

  parse(text) {
    return new Promise((resolve, reject) => {
      const captions = [];
      const xml = this.parser.parseFromString(text, 'text/xml');
      const tt = xml.querySelector('tt');
      let tickRate;
      if (tt) {
        tickRate = tt.getAttribute('ttp:tickRate');
      }
      const body = xml.querySelector('body');
      const captionsContainer = xml.querySelector('div[xml:space="preserve"]');
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
                  lastCaption.text = `${lastCaption.text}<br/>${currentChild.innerHTML}`;
                  // TODO - ^ Will be a breaking change to observer creating the new caption element
                  // TODO -   As it will need to set innerHTML instead of textContent
                  // TODO -   Probably another good case for moving logic of the observer tbh
                } else {
                  captions.push({
                    startTime: startTime,
                    endTime: endTime,
                    text: currentChild.innerHTML
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
  }
}

window.DC.parser = new NetflixTranslationParser();
