const NetflixParser = require('./parser');

const NetflixIntegration = {
  siteId: 'netflix',
  captionRequestPattern: 'https://*.nflxvideo.net/?o=*&v=*&e=*&t=*',
  injectPattern: 'https://www.netflix.com/*',
  detectSite: url => url.includes('netflix'),
  detectVideoId: () => {
    const videoIdPattern = /watch\/(\d+)/;
    const pathname = window.location.pathname;
    if (videoIdPattern.test(pathname)) {
      return videoIdPattern.exec(pathname)[1];
    } else {
      return null;
    }
  },
  parser: NetflixParser
}

module.exports = NetflixIntegration;
