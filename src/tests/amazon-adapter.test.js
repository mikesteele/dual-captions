import expect from 'expect';
const fs = require('fs');
const path = require('path');

// Load DOM from snapshot
const videoPage = fs.readFileSync(path.resolve(__dirname, './assets/amazon/video.txt'));
document.body.innerHTML = videoPage;

// Load adapter
import '../../public/content-scripts/init/init';
import '../../public/content-scripts/init/adapter';
import '../../public/content-scripts/amazon/adapter';

const adapter = window.DC.adapter;

const captionWindow = adapter.getCaptionWindow();

const mockMutationRecord = {
  addedNodes: [captionWindow.childNodes],
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
  expect(player.classList.contains('dv-player-fullscreen')).toEqual(true);
});

it('should correctly appendToDOM', () => {
  /**

  At the start, the caption window's child nodes look like:

  <text>It's just a thought...</text>
  <br/>
  <text>But if you ever move on</text>
  <br/>
  <text>from Norman,</text>

  **/
  expect(captionWindow.childNodes.length).toEqual(5);

  // Append a new caption to the DOM
  const testElement = document.createElement('div');
  testElement.textContent = 'This is a test caption';
  adapter.appendToDOM(testElement);

  // Now, there are 7 nodes, the previous 5 nodes, a <br/> and the new caption element.
  expect(captionWindow.childNodes.length).toEqual(7);
  expect(captionWindow.lastChild.textContent).toEqual('This is a test caption');
});

it('should get new caption from mutation', () => {
  const result = adapter.getNewCaption(mockMutationRecord);
  expect(result).toEqual(captionWindow);
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
