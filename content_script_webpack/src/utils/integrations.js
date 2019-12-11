const Integrations = require('dual-captions-site-integrations').integrations;

const getIntegrationForSite = site => {
  const matchingIntegration = Integrations.find(i => i.siteId === site);
  if (matchingIntegration) {
    return matchingIntegration;
  } else {
    console.error(`Could not find matching integration for site: ${site}`);
  }
}

export { getIntegrationForSite };
