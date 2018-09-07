import expect from 'expect';
const fs = require('fs');
const path = require('path');

// Load DOM from snapshot
const videoPage = fs.readFileSync(path.resolve(__dirname, './assets/youtube/video.txt'));
document.body.innerHTML = videoPage;

// Load adapter
import '../../public/content-scripts/init/init';
import '../../public/content-scripts/init/adapter';
import '../../public/content-scripts/youtube/adapter';

const adapter = window.DC.config;

const captionsContainer = document.querySelector('.captions-text');
const newCaption = captionsContainer.firstChild;
const mockMutationRecord = {
  addedNodes: [newCaption],
  attributeName: null,
  attributeNamespace: null,
  nextSibling: null,
  oldValue: null,
  previousSibling: null,
  removedNodes: [],
  target: captionsContainer,
  type: 'childList'
};

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
  const result = adapter.getNewCaption(mockMutationRecord);
  expect(result).toEqual(newCaption);
});

it('should correctly indentify captionWasAdded', () => {
  expect(adapter.captionWasAdded(mockMutationRecord)).toEqual(true);

  // No nodes added
  expect(adapter.captionWasAdded({
    ...mockMutationRecord,
    addedNodes: []
  })).toEqual(false);

  // Not the right target
  expect(adapter.captionWasAdded({
    ...mockMutationRecord,
    target: adapter.getPlayer()
  })).toEqual(false);
});

it('should correctly respond to onPopupOpened', () => {
  const response = adapter.onPopupOpened();
  expect(response).toEqual({
    ok: true
  });
});
