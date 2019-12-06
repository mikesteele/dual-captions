const NetflixIntegration = require('./netflix');
const YouTubeIntegration = require('./youtube');
const DevelopmentIntegration = require('./development');
const KanopyIntegration = require('./kanopy');

module.exports = {
  integrations: [
    NetflixIntegration,
    YouTubeIntegration,
    DevelopmentIntegration,
    KanopyIntegration
  ]
};
