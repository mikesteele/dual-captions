import expect from 'expect';
const fs = require('fs');
const path = require('path');

// Load DOM from snapshot
const videoPage = fs.readFileSync(path.resolve(__dirname, './assets/youtube/video.html'));
document.body.innerHTML = videoPage;

// Load adapter
import '../../public/content-scripts/init';
import '../../public/content-scripts/config/init';
import '../../public/content-scripts/config/youtube';

const adapter = window.DC.config;

it('should get player element', () => {
  const player = adapter.getPlayer();
  expect(player.classList.contains('html5-video-player')).toEqual(true);
});

it('should correctly appendToDOM', () => {
  const captionWindow = adapter.getCaptionWindow();
  expect(captionWindow.childNodes.length).toEqual(1);
  // Snapshot initially has one child in caption window, the original caption.

  const testElement = document.createElement('div');
  testElement.textContent = 'This is a test caption';
  adapter.appendToDOM(testElement);

  // Snapshot should now have three nodes in caption window:
  // The original caption, a <br/>, and the translated caption
  expect(captionWindow.childNodes.length).toEqual(3);
  expect(captionWindow.lastChild.textContent).toEqual('This is a test caption');
});

it('should get new caption from mutation', () => {
  /**
  TODO -
  const mutationRecord = {
    addedNodes: NodeList [span.original-caption.translated],
    attributeName: null,
    attributeNamespace: null,
    nextSibling: null,
    oldValue: null,
    previousSibling: null,
    removedNodes: NodeList [],
    target: span.captions-text,
    type: "childList"
  }
  **/
});
