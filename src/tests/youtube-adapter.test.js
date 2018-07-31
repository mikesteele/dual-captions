import expect from 'expect';
const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const videoPage = fs.readFileSync(path.resolve(__dirname, './assets/youtube/video.html'));
const dom = new JSDOM(videoPage);
let document = dom.window.document;

import '../../public/content-scripts/init';
import '../../public/content-scripts/config/init';
import '../../public/content-scripts/config/youtube';

const adapter = window.DC.config;

it('should get player element', () => {
  const player = adapter.getPlayer();
  expect(player.classList.contains('html5-video-player')).to.be.true;
});
