const AmazonAdapter = require('./adapter');

const AmazonIntegration = {
  siteId: 'amazon',
  injectPattern: 'https://*.amazon.com/*',
  detectSite: url => url.includes('amazon'),
  detectVideoId: () => window.location.href,
  adapter: AmazonAdapter
};

module.exports = AmazonIntegration;
