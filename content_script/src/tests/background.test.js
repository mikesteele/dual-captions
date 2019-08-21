import './chrome-mock';
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import '../../public/background';

const MOCK_CAPTION_REQUEST_URL = 'https://ipv4-c009-bos001-ix.1.oca.nflxvideo.net/?o=AQGEcOavLssMXe3YasJMNARs9BDCrMSrUV_ZwavCYGePyLsYfOgBIxlr9R80J9lBBNKyghiifjNOnjd9LMuRg93_wXPlUhhR1fXXxJVCMWQZR0wWpsbQZzrbIm4yxStAvXkuTZbm_GI0Bvjc-jYbEeZNprLvcpq-7ouKyvi7lm9WNnx9tCfQgraLN8ndOQDOacv4fDr7-RAHzh1c-3veZNn4eA&v=3&e=1536283465&t=SGlFE7VQbMfhRqbODJy-Bh1gud';
const MOCK_TAB_ID = 123456;

const background = window.background;

const wait = (amount) => new Promise(resolve => setTimeout(resolve, amount));

it('should pass integration test', done => {
  // Set spies
  sinon.spy(background, 'sendMessageToTabId');

  // Intercept a Netflix caption request
  background.onBeforeNetflixCaptionRequest({
    tabId: MOCK_TAB_ID,
    url: MOCK_CAPTION_REQUEST_URL
  });

  // It should set MOCK_CAPTION_REQUEST_URL in captionRequestsInFlight
  expect(background.captionRequestsInFlight).to.deep.equal({
    [MOCK_CAPTION_REQUEST_URL]: true
  });

  // It should "send message" (create a pending message) to sender tabId
  expect(background.pendingMessagesForTabId[MOCK_TAB_ID].length).to.equal(1);
  var {
    resolve,
    reject,
    ...backgroundPendingMessageWithoutFuncs
  } = background.pendingMessagesForTabId[MOCK_TAB_ID][0];
  expect(backgroundPendingMessageWithoutFuncs).to.deep.equal({
    type: 'process-caption-request',
    payload: MOCK_CAPTION_REQUEST_URL
  });

  // Intercepting the same caption request again shouldn't send any messages
  background.onBeforeNetflixCaptionRequest({
    tabId: MOCK_TAB_ID,
    url: MOCK_CAPTION_REQUEST_URL
  });
  background.onBeforeNetflixCaptionRequest({
    tabId: 456,
    url: MOCK_CAPTION_REQUEST_URL
  });
  background.onBeforeNetflixCaptionRequest({
    tabId: 123,
    url: MOCK_CAPTION_REQUEST_URL
  });
  // Should still be only one pending message
  expect(background.pendingMessagesForTabId[MOCK_TAB_ID].length).to.equal(1);


  // Tab requests pending messages
  background.onMessage({
    type: 'get-pending-messages'
  }, {
    tab: {
      id: MOCK_TAB_ID
    }
  }, () => {});
  wait(200).then(() => {
    expect(window.chrome.tabs.sendMessage.calledOnce).to.be.true;
    expect(background.pendingMessagesForTabId[MOCK_TAB_ID]).to.be.undefined;
    background.onMessage({
      type: 'get-pending-messages'
    }, {
      id: MOCK_TAB_ID
    }, () => {});

    wait(200).then(() => {
      expect(window.chrome.tabs.sendMessage.calledOnce).to.be.true;
      done();
    });
  });
});
