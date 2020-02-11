const iconv = require('iconv-lite');
const jschardet = require('jschardet');

/**

A helper for converting an SRT file of any encoding into a JS string.

*/

const processSrtFile = file => {
  return new Promise((resolve, reject) => {
    if (file) {
      const detectedEncoding = jschardet.detect(file);
      if (detectedEncoding && detectedEncoding.encoding && iconv.encodingExists(detectedEncoding.encoding)) {
        const result = iconv.decode(file, detectedEncoding.encoding);
        resolve(result);
      } else {
        console.error(`processSrtFile - No supported encoding, detectedEncoding: ${JSON.stringify(detectedEncoding)}`);
        reject();
      }
    } else {
      console.error('processSrtFile - No file');
      reject();
    }
  });
}

module.exports = processSrtFile;
