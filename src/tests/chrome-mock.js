import sinon from 'sinon';

import './mocks';
import '../../public/content-scripts/init';
import '../../public/content-scripts/config/init';
import '../../public/content-scripts/config/test';
import '../../public/content-scripts/dual-captions';

const mockTabs = [{
  id: 1
}];

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
  }
};
