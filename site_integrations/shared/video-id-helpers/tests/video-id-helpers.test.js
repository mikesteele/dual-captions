const { expect } = require('chai');
const getVideoIdFromVideoSrc = require('../index').getVideoIdFromVideoSrc;

describe('getVideoIdFromVideoSrc', () => {
  it('should work for video with blob', () => {
    const video = document.createElement('video');
    const id = 'werkjewkjrjwerwer';
    video.src = `blob:https://netflix.com/${id}`;
    document.body.appendChild(video);

    expect(getVideoIdFromVideoSrc()).to.equal(id);
    document.body.removeChild(video);
  });
  it('should work for video with static src', () => {
    const video = document.createElement('video');
    video.src = 'https://netflix.com/video.mp4';
    document.body.appendChild(video);

    expect(getVideoIdFromVideoSrc()).to.equal('https://netflix.com/video.mp4');
    document.body.removeChild(video);
  });
  it('should return null if no video', () => {
    expect(getVideoIdFromVideoSrc()).to.equal(null);
  });
});
