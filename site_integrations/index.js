const NetflixIntegration = {
  siteId: 'netflix',
  captionRequestPattern: 'https://*.nflxvideo.net/?o=*&v=*&e=*&t=*'
}

const YouTubeIntegration = {
  siteId: 'youtube',
  captionRequestPattern: 'https://www.youtube.com/api/timedtext*'
}

module.exports = {
  integrations: [
    NetflixIntegration,
    YouTubeIntegration
  ]
};
