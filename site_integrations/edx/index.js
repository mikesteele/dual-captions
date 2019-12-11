const EdxAdapter = require('./adapter');
const EdxParser = require('./parser');

const EdxIntegration = {
  siteId: 'edx',
  captionRequestPattern: 'https://courses.edx.org/*/translation/*',
  injectPattern: "https://courses.edx.org/*",
  detectSite: url => url.includes('edx'),
  detectVideoId: () => {
    return window.document.title;
  },
  parser: EdxParser,
  adapter: EdxAdapter
}

module.exports = EdxIntegration;
