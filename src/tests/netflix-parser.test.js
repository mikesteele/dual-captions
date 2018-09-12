import expect from 'expect';
const fs = require('fs');
const path = require('path');
const exampleFetch = fs.readFileSync(path.resolve(__dirname, './assets/netflix/fetch-en-cc.txt'));
// TODO - Add tests for fetch-fr.txt

import '../../public/content-scripts/init/init';
import '../../public/content-scripts/init/parser';
import '../../public/content-scripts/netflix/parser';

const parser = window.DC.parser;

// Sanity tests
it('fetch should pass sanity tests', () => {
  /**
   * Current Netflix parser expects body to look like this:
   *
   * <body>
   *   <div xml:space="preserve">
   *      // Caption elements
   *   </div>
   * </body>
   *
   */
   // This should really its own parser method to avoid de-duplicating code here
   const xml = parser.parser.parseFromString(exampleFetch, 'text/xml');
   const body = xml.querySelector('body');
   const captionsContainer = body.firstElementChild;
   expect(!!body).toEqual(true);
   expect(!!captionsContainer).toEqual(true);
   expect(captionsContainer.getAttribute('xml:space')).toEqual('preserve');
   expect(captionsContainer.children[0].tagName).toEqual('p');
});

it('should correctly parse Netflix captions', done => {
  parser.parse(exampleFetch)
    .then(captions => {
      console.log(captions);
      done();
    })
    .catch(err => { console.log(err)});
});
