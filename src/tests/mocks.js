import sinon from 'sinon';

window.chrome = {
  runtime: {
    onMessage: {
      addListener: () => {
        console.log('mocks: Adding listener for window.chrome.runtime.onMessage');
      }
    }
  }
}

class MutationObserver {
  constructor() {
    console.log('mocks: Creating mock MutationObserver');
  }
  disconnect() {
    console.log('mocks: Disconnecting MutationObserver');
  }
  observe(el) {
    if (!el) {
      throw 'mocks: Missing element to observe';
    }
    console.log('mocks: MutationObserver began observing');
  }
}

window.MutationObserver = MutationObserver;
