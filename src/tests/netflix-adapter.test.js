import expect from 'expect';
const fs = require('fs');
const path = require('path');

// Load DOM from snapshot
const videoPage = fs.readFileSync(path.resolve(__dirname, './assets/netflix/video.txt'));
document.body.innerHTML = videoPage;

// Load adapter
import '../../public/content-scripts/init';
import '../../public/content-scripts/config/init';
import '../../public/content-scripts/config/netflix';

const adapter = window.DC.config;

const captionWindow = adapter.getCaptionWindow();
const newCaption = captionWindow.firstChild;
const mockMutationRecord = {
  addedNodes: [newCaption],
  attributeName: null,
  attributeNamespace: null,
  nextSibling: null,
  oldValue: null,
  previousSibling: null,
  removedNodes: [],
  target: captionWindow,
  type: 'childList'
};

it('should get player element', () => {
  const player = adapter.getPlayer();
  expect(player.classList.contains('VideoContainer')).toEqual(true);
});


it('should correctly appendToDOM', () => {
  expect(captionWindow.children.length).toEqual(1);
  expect(captionWindow.firstChild.classList.contains('player-timedtext-text-container')).toEqual(true);
  // Snapshot initially has one child in caption window, a <player-timedtext-text-container> with the original caption as a child.

  const testElement = document.createElement('div');
  testElement.textContent = 'This is a test caption';
  adapter.appendToDOM(testElement);

  // Snapshot should now have two nodes in caption window:
  // The original caption and a DC window
  expect(captionWindow.children.length).toEqual(2);
  expect(captionWindow.lastChild.classList.contains('dual-captions-window')).toEqual(true);

  // DC window should contain the test caption
  const dcWindow = captionWindow.lastChild;
  expect(dcWindow.children.length).toEqual(1);
  expect(dcWindow.firstChild.textContent).toEqual('This is a test caption');

  // Clean up
  captionWindow.removeChild(dcWindow);

  // Caption window should only have the original caption.
  expect(captionWindow.children.length).toEqual(1);
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

  /**

  TODO

  it('shouldn't react to a DC caption being added to DOM')

  const dcCaption = observer.createDcCaption('This is a test');
  const dcMutationRecord = {
    ...mockMutationRecord,
    addedNodes: [dcCaption]
  }
  expect(adapter.captionWasAdded(dcMutationRecord)).toEqual(false);

  **/
});

it('should correctly _saveOriginalPosition', () => {
  let testCaption = newCaption.cloneNode(true);
  // TODO - Why doesn't this work? - expect(testCaption.hasAttribute('__has-original-position__')).toEqual(false);
  adapter._saveOriginalPosition(testCaption);
  expect(testCaption.hasAttribute('__original-top__')).toEqual(true);
  // TODO - Why is this null? - expect(testCaption.getAttribute('__original_top__')).toEqual('76.6063%');
});

// TODO - Test makeDcWindow, moveNetflixCaptions, various other helpers
