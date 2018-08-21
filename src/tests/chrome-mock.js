import sinon from 'sinon';


// FIXME: This file shouldn't create the observer

import './mocks';
import '../../public/content-scripts/init';
import '../../public/content-scripts/config/init';
import '../../public/content-scripts/config/test';
import '../../public/content-scripts/dual-captions';

const mockTabs = [{
  id: 1
}];

// TODO - Add tests for this mock
export class ChromeStorageMock {
  constructor() {
    this.mockStorage = {};
    this.set = this.set.bind(this);
  }

  set(key, value) {
    this.mockStorage[key] = value;
  }

  get(key, callback) {
    if (this.mockStorage.hasOwnProperty(key)) {
      callback(this.mockStorage[key]);
    } else {
      // TODO - What does chrome do?
    }
  }
}

// TODO - Mock storage

window.chrome = {
  ...window.chrome,
  tabs: {
    query: (options, callback) => {
      console.log('chrome-mock: chrome.tabs.query called');
      callback(mockTabs);
    },
    sendMessage: (tabId, message, sendResponse) => {
      console.log('chrome-mock: chrome.tabs.sendMessage called');
      try {
        window.DC.DUAL_CAPTIONS._onMessage(message, undefined, sendResponse);
      } catch(e) {
        sendResponse(undefined);
      }
    }
  },
  webRequest: {
    onBeforeRequest: {
      addListener: sinon.stub()
    }
  },
  storage: new ChromeStorageMock()
};
