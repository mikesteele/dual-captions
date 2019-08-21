import expect from 'expect';
const fs = require('fs');
const path = require('path');

// Load DOM from snapshot
const videoPage = fs.readFileSync(path.resolve(__dirname, './assets/youtube/video-with-automatic-subtitles.txt'));
document.body.innerHTML = videoPage;

// Load adapter
import '../../public/content-scripts/init/init';
import '../../public/content-scripts/init/adapter';
import '../../public/content-scripts/youtube/adapter';

const adapter = window.DC.adapter;

it('should respond with `automatic-subtitles` error on onPopupOpened', () => {
  const response = adapter.onPopupOpened();
  expect(response).toEqual({
    ok: false,
    errorType: 'automatic-subtitles'
  });
});

it('should not use automatic captions window', () => {
  const captionWindow = adapter.getCaptionWindow();
  expect(captionWindow).toEqual(null);
});
