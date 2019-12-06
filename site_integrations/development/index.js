const DevelopmentAdapter = () => {
  const playerControls = document.querySelector('#player-controls');
  return {
    playerControls
  }
};

const DevelopmentIntegration = {
  siteId: 'development',
  detectSite: url => url.includes('localhost'),
  detectVideoId: () => 'development',
  adapter: DevelopmentAdapter
};

module.exports = DevelopmentIntegration;
