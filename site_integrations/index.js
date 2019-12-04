const NetflixIntegration = require('./netflix');
const YouTubeIntegration = require('./youtube');
const DevelopmentIntegration = require('./development');

module.exports = {
  integrations: [
    NetflixIntegration,
    YouTubeIntegration,
    DevelopmentIntegration
  ]
};
