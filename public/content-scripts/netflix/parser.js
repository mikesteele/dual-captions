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
      const body = xml.querySelector('body');
      const captionsContainer = xml.querySelector('div[xml:space="preserve"]');
      if (body && captionsContainer) {
        for (let i = 0; i < captionsContainer.children.length; i++) {
          const currentChild = captionsContainer.children[i];
          if (currentChild.tagName === 'p') {
            const begin = currentChild.getAttribute('begin');
            const end = currentChild.getAttribute('end');
            if (begin && end) {
              // TODO - use tickRate?
              // TODO - probably reject if begin or end doesn't match /[0-9]+t/g
              // TODO - If the last caption has the same times, add it to that caption.
              // TODO - ^ This is that "two caption containers in the DOM" nonsense
              captions.push({
                startTime: 0,
                endTime: 0,
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
        reject(`Can't parse invalid Netfix caption file`);
      }
    });
  }
}

window.DC.parser = new NetflixTranslationParser();
