const DisneyPlusParser = require('./parser');
const DisneyPlusAdapter = require('./adapter');

const DisneyPlusIntegration = {
  siteId: 'disneyplus',
  detectSite: url => url.includes('disneyplus.com'),
  detectVideoId: () => {
    // Ex. https://www.disneyplus.com/fr-fr/video/fa23824c-95ec-4818-a31b-e61591c65af7
    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    if (parts[2] === 'video') {
      return parts[3];
    } else {
      return null;
    }
  },
  injectPattern: 'https://www.disneyplus.com/*',
  captionRequestPattern: 'https://*.dssott.com/*/disney/*/seg_*.vtt',
  parser: DisneyPlusParser,
  adapter: DisneyPlusAdapter
}

module.exports = DisneyPlusIntegration;
