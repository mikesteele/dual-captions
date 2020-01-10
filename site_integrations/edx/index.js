const EdxAdapter = require('./adapter');
const EdxParser = require('./parser');
const { getVideoIdFromVideoSrc } = require('../shared/video-id-helpers');

const EdxIntegration = {
  siteId: 'edx',
  captionRequestPattern: 'https://courses.edx.org/*/translation/*',
  injectPattern: "https://courses.edx.org/*",
  detectSite: url => url.includes('edx'),
  detectVideoId: getVideoIdFromVideoSrc,
  parser: EdxParser,
  adapter: EdxAdapter
}

module.exports = EdxIntegration;
