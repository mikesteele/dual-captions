import sinon from 'sinon';
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

// For URLSearchParams
require('url-polyfill');

const adapter = window.DC.adapter;

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

it('should correctly get video ID', () => {
  const exampleYouTubeURL = 'https://www.youtube.com/watch?v=NrJEFrth27Q';
  // Set window.location.href to example URL
  Object.defineProperty(window.location, 'href', {
    writable: true, value: exampleYouTubeURL
  });
  expect(adapter.getVideoId()).toEqual('NrJEFrth27Q');
});

it('should correctly get player current time', () => {
  const videoElement = adapter.getPlayer().querySelector('video');
  videoElement.currentTime = 1234;
  expect(adapter.getPlayerCurrentTime()).toEqual(1234);
});

it('getPlayerCurrentTime() should return undefined if no player', () => {
  sinon.stub(adapter, 'getPlayer').returns(null);
  expect(adapter.getPlayerCurrentTime()).toEqual(undefined);
  adapter.getPlayer.restore();
});

it('should correctly style new caption element', () => {
  let translatedCaption = document.createElement('div');
  translatedCaption = adapter.styleCaptionElement(translatedCaption, mockMutationRecord);
  // Translated caption should get the .captions-text class
  expect(translatedCaption.classList.contains('captions-text')).toEqual(true);
  // Translated caption should get the same inline styles as the current caption has.
  expect(translatedCaption.style.cssText === newCaption.style.cssText).toEqual(true);
});
