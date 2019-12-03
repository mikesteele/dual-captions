const NetflixIntegration = require('./netflix');
const YouTubeIntegration = require('./youtube');

const DevelopmentIntegration = {
  siteId: 'development',
  detectSite: url => url.includes('localhost'),
  detectVideoId: () => 'development'
}

module.exports = {
  integrations: [
    NetflixIntegration,
    YouTubeIntegration,
    DevelopmentIntegration
  ]
};
