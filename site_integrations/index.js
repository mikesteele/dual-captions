const NetflixIntegration = {
  siteId: 'netflix',
  captionRequestPattern: 'https://*.nflxvideo.net/?o=*&v=*&e=*&t=*',
  injectPattern: 'https://www.netflix.com/*'
}

const YouTubeIntegration = {
  siteId: 'youtube',
  captionRequestPattern: 'https://www.youtube.com/api/timedtext*',
  injectPattern: 'https://www.youtube.com/*'
}

const DevelopmentIntegration = {
  siteId: 'development'
}

module.exports = {
  integrations: [
    NetflixIntegration,
    YouTubeIntegration,
    DevelopmentIntegration
  ]
};
