const KanopyAdapter = require('./adapter');
const WebVttParser = require('../shared/web-vtt-parser');

const KanopyIntegration = {
  siteId: 'kanopy',
  captionRequestPattern: 'https://*.kanopy.com/captioncache/webvtt/*.vtt',
  injectPattern: 'https://*.kanopy.com/*',
  detectSite: url => url.includes('kanopy'),
  detectVideoId: () => {
    const videoIdPattern = /video\/(.+)/;
    const pathname = window.location.pathname;
    if (videoIdPattern.test(pathname)) {
      return videoIdPattern.exec(pathname)[1];
    } else {
      return null;
    }
  },
  parser: WebVttParser,
  adapter: KanopyAdapter
};

module.exports = KanopyIntegration;
