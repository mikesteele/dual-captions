import expect from 'expect';
const fs = require('fs');
const path = require('path');

// Load DOM from snapshot
const videoPage = fs.readFileSync(path.resolve(__dirname, './assets/youtube/video-with-automatic-subtitles.txt'));
document.body.innerHTML = videoPage;

// Load adapter
import '../../public/content-scripts/init';
import '../../public/content-scripts/config/init';
import '../../public/content-scripts/config/youtube';

const adapter = window.DC.config;

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
