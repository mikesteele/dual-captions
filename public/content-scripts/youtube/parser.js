class YouTubeTranslationParser extends TranslationParser {
  constructor() {
    super();
    this.parser = new DOMParser();
    this.parse = this.parse.bind(this);
  }

  parse(text) {
    return new Promise((resolve, reject) => {
      let captions = [];
      const xml = this.parser.parseFromString(text, 'text/xml');
      const body = xml.querySelector('body');
      if (body) {
        for (let i = 0; i < body.childNodes.length; i++) {
          let currentNode = body.childNodes[i];
          if (currentNode.tagName === 'p') {
            const t = currentNode.getAttribute('t');
            const d = currentNode.getAttribute('d');
            if (t && d) {
              const tNum = parseInt(t);
              const dNum = parseInt(d);
              captions.push({
                startTime: tNum,
                endTime: tNum + dNum,
                text: currentNode.textContent
              });
            }
          }
        }
        resolve(captions);
      } else {
        reject(`Can't parse invalid YouTube caption file`);
      }
    });
  }
}

window.DC.parser = new YouTubeTranslationParser();
