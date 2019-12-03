const YouTubeParser = require('./parser');

const YouTubeIntegration = {
  siteId: 'youtube',
  captionRequestPattern: 'https://www.youtube.com/api/timedtext*',
  injectPattern: 'https://www.youtube.com/*',
  detectSite: url => url.includes('youtube'),
  detectVideoId: () => {
    const url = new URL(window.location.href);
    const videoId = url.searchParams.get('v');
    return videoId ? videoId : null;
  },
  parser: YouTubeParser
}

module.exports = YouTubeIntegration;
