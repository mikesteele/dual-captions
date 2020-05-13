const franc = require('franc');
const Integrations = require('dual-captions-site-integrations').integrations;

class BackgroundPage {
  constructor() {
    // Properties
    this.captionRequestsInFlight = {};
    this.pendingMessagesForTabId = {}; // tabId: [Messages]

    // Binds
    this.onTabUpdated = this.onTabUpdated.bind(this);
    this.sendMessageToTabId = this.sendMessageToTabId.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.sendPendingMessages = this.sendPendingMessages.bind(this);

    // Set up listeners for integration caption requests
    Integrations.forEach(integration => {
      if (integration.captionRequestPattern) {
        const onBeforeRequest = (details) => {
          const tabId = details.tabId;
          if (!(details.url in this.captionRequestsInFlight)) {
            this.captionRequestsInFlight[details.url] = true;
            this.sendMessageToTabId(tabId, {
              type: 'process-caption-request',
              payload: details.url
            });
          }
        };
        window.chrome.webRequest.onBeforeRequest.addListener(
          onBeforeRequest, {
            urls: [integration.captionRequestPattern]
          }
        );
      }
    });

    window.chrome.tabs.onUpdated.addListener(this.onTabUpdated);
    window.chrome.runtime.onMessage.addListener(this.onMessage);
  }

  sendPendingMessages(tabId) {
    if (tabId in this.pendingMessagesForTabId) {
      this.pendingMessagesForTabId[tabId].forEach(message => {
        window.chrome.tabs.sendMessage(tabId, message, () => {});
      });
      delete this.pendingMessagesForTabId[tabId];
    }

  }

  sendMessageToTabId(tabId, message) {
    if (!tabId) {
      return null;
    } else if (tabId in this.pendingMessagesForTabId) {
      this.pendingMessagesForTabId[tabId].push(message);
    } else {
      this.pendingMessagesForTabId[tabId] = [message];
    }
  }

  onMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'get-pending-messages':
      if (sender.tab && sender.tab.id) {
        this.sendPendingMessages(sender.tab.id);
        sendResponse({ ok: true });
      }
      break;

      case 'detect-language':
      console.log(`Detecting ${message.payload}`);
      const result = franc(message.payload);
      sendResponse(result);
      break;
    }
  }

  onTabUpdated(tabId, changeInfo, tab) {
    if (tabId && changeInfo.url) {
      // Let content scripts know the URL changed
      window.chrome.tabs.sendMessage(tabId, {
        type: 'tab-updated-url' // TODO - Test
      }, () => {});
    }
  }
}

window.background = new BackgroundPage();
