const getVideoIdFromVideoSrc = () => {
  const video = document.querySelector('video');
  if (video && video.src) {
    if (video.src.includes('blob')) {
      const parts = video.src.split('/');
      return parts[parts.length - 1];
    } else {
      return video.src;
    }
  } else {
    return null;
  }
}

module.exports = {
  getVideoIdFromVideoSrc
};
