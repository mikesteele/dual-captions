import expect from 'expect';
const fs = require('fs');
const path = require('path');

// Load DOM from snapshot
const videoPage = fs.readFileSync(path.resolve(__dirname, './assets/youtube/video-with-caption-window-top.txt'));
document.body.innerHTML = videoPage;

// Load adapter
import '../../public/content-scripts/init/init';
import '../../public/content-scripts/init/adapter';
import '../../public/content-scripts/youtube/adapter';

const adapter = window.DC.adapter;

it('should ignore additions to ytp-caption-window-top', () => {
  /**

  The "top caption window" currently looks like this:

  <div class="caption-window ytp-caption-window-top">
    <span class="captions-text">
      <span>TEXT HERE</span>
    </span>
  </div>

  **/
  const captionWindowTop = document.querySelector('.ytp-caption-window-top');

  // Sanity tests
  expect(!!captionWindowTop).toEqual(true);
  expect(captionWindowTop.firstChild.classList.contains('captions-text')).toEqual(true);

  const mockMutationRecord = {
    addedNodes: [captionWindowTop.firstChild.firstChild],
    attributeName: null,
    attributeNamespace: null,
    nextSibling: null,
    oldValue: null,
    previousSibling: null,
    removedNodes: [],
    target: captionWindowTop.firstChild,
    type: 'childList'
  };

  expect(adapter.captionWasAdded(mockMutationRecord)).toEqual(false);
});
