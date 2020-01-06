const NetflixIntegration = require('./netflix');
const YouTubeIntegration = require('./youtube');
const DevelopmentIntegration = require('./development');
const KanopyIntegration = require('./kanopy');
const SrtParser = require('./shared/srt-parser');
const SrtEncoder = require('./shared/srt-encoder');

module.exports = {
  integrations: [
    NetflixIntegration,
    YouTubeIntegration,
    DevelopmentIntegration,
    KanopyIntegration
  ],
  encoders: {
    SrtEncoder
  },
  parsers: {
    SrtParser
  }
};
