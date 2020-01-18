const NetflixIntegration = require('./netflix');
const YouTubeIntegration = require('./youtube');
const DevelopmentIntegration = require('./development');
const KanopyIntegration = require('./kanopy');
const AmazonIntegration = require('./amazon');
const SrtParser = require('./shared/srt-parser');
const SrtEncoder = require('./shared/srt-encoder');

module.exports = {
  integrations: [
    NetflixIntegration,
    YouTubeIntegration,
    DevelopmentIntegration,
    KanopyIntegration,
    AmazonIntegration
  ],
  encoders: {
    SrtEncoder
  },
  parsers: {
    SrtParser
  }
};
