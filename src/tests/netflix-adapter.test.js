import expect from 'expect';
const fs = require('fs');
const path = require('path');

// Load adapter
import '../../public/content-scripts/init/init';
import '../../public/content-scripts/init/adapter';
import '../../public/content-scripts/netflix/adapter';

// Load DOM from snapshot
const videoPage = fs.readFileSync(path.resolve(__dirname, './assets/netflix/video.txt'));
document.body.innerHTML = videoPage;

const adapter = window.DC.adapter;

it('should correctly get video ID', () => {
  const exampleUrl = '/watch/80115431?tctx=0%2C1%2C11efbb93-c1c7-49f8-ac59-785236775877-94472464%2Cgallery-subtitles-00b2c183-d803-4046-a0e2-5df2a4d73478_0%2C';
  window.history.pushState({}, 'Netflix', exampleUrl);
  // ^ See https://github.com/facebook/jest/issues/890#issuecomment-415202799
  expect(adapter.getVideoId()).toEqual('80115431');
});

it('should correctly get player current time', () => {
  const videoElement = document.querySelector('video');
  videoElement.currentTime = 1234;
  const currentTime = adapter.getPlayerCurrentTime();
  expect(currentTime).toEqual(1234);
});
