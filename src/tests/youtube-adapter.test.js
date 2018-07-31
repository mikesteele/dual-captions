import expect from 'expect';
const fs = require('fs');
const path = require('path');

const videoPage = fs.readFileSync(path.resolve(__dirname, './assets/youtube/video.html'));
document.body.innerHTML = videoPage;

import '../../public/content-scripts/init';
import '../../public/content-scripts/config/init';
import '../../public/content-scripts/config/youtube';

const adapter = window.DC.config;

it('should get player element', () => {
  const player = adapter.getPlayer();
  expect(player.classList.contains('html5-video-player')).toEqual(true);
});
