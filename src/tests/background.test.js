import './chrome-mock';
import '../../public/background';

import sinon from 'sinon';
import match from 'url-match-patterns';

const background = window.DC_BackgroundPage;

// Default Jest JSDOM has no URLSearchParams support lol
require('url-polyfill');

jest.useFakeTimers();

it('should set listeners for YouTube and Netflix caption requests', () => {
  expect(chrome.webRequest.onBeforeRequest.addListener.calledTwice).toEqual(true);
  expect(chrome.webRequest.onBeforeRequest.addListener.calledWith(background._onBeforeNetflixCaptionRequest)).toEqual(true);
  expect(chrome.webRequest.onBeforeRequest.addListener.calledWith(background._onBeforeYouTubeCaptionRequest)).toEqual(true);
});

it('should correctly match Netflix caption requests and ignore others', () => {
  // Sanity test
  expect(!!window.NETFLIX_CAPTION_REQUEST_PATTERN).toEqual(true);

  const matches = match(window.NETFLIX_CAPTION_REQUEST_PATTERN);
  const netflixCaptionRequest = 'https://ipv4-c009-bos001-ix.1.oca.nflxvideo.net/?o=AQGEcOavLssMXe3YasJMNARs9BDCrMSrUV_ZwavCYGePyLsYfOgBIxlr9R80J9lBBNKyghiifjNOnjd9LMuRg93_wXPlUhhR1fXXxJVCMWQZR0wWpsbQZzrbIm4yxStAvXkuTZbm_GI0Bvjc-jYbEeZNprLvcpq-7ouKyvi7lm9WNnx9tCfQgraLN8ndOQDOacv4fDr7-RAHzh1c-3veZNn4eA&v=3&e=1536283465&t=SGlFE7VQbMfhRqbODJy-Bh1gud';

  // These /range/ requests are used for video streaming and also (I think?) Chinese & Japanese image subtitles, which aren't supported at this time.
  const netflixRangeRequest = 'https://ipv4-c091-bos001-ix.1.oca.nflxvideo.net/range/88238838-88630781?o=AQGEcOavLssMXM3eb8dPMQ5u9g2Io8-2GAOHia2XKDSDyLsef_pDekdp8BYwO8EKUp-5mgfdR3Iz7HczWP3Xh6DM7knPRhhy18n53IJkPnw2enMXm7-4XDDQHn4Bhks__m5hQIS39nQYDYevnV9eNP0T5rf0dpum75TQi7amiHMCaS405nHXlawbKJXMM17XV5mkUjj-rkVD1QtM4HKFc5L3e8V65w&v=3&e=1536287465&t=NPwnJsXZXLBolwMJx-5NRuX8Xa4&sc=EqI%27%13%0Bz%0CJ%01qA%07%05%7CLc%5Cv%60t%15%1FrQ_%0C%3Bzj';

  expect(matches(netflixCaptionRequest)).toEqual(true);
  expect(matches(netflixRangeRequest)).toEqual(false);

  // Verify URL matches if from other data centers
  const ezeNetflixCaptionRequest = netflixCaptionRequest.replace('ipv4-c009-bos001-ix.1.oca.nflxvideo.net', 'neipv4-c010-eze002-prima-isp.1.oca.nflxvideo.net');
  const miaNetflixCaptionRequest = netflixCaptionRequest.replace('ipv4-c009-bos001-ix.1.oca.nflxvideo.net', 'ipv4-c134-mia003-ix.1.oca.nflxvideo.net');

  expect(matches(ezeNetflixCaptionRequest)).toEqual(true);
  expect(matches(miaNetflixCaptionRequest)).toEqual(true);

  // Shouldn't match if it's missing query params
  const url = new URL(netflixCaptionRequest);
  url.searchParams.delete('e');
  expect(matches(url.href)).toEqual(false);
});

it(`shouldn't trigger _onBeforeNetflixCaptionRequest on replay`, () => {
  // Set up
  const delayedPromise = new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve({
        ok: true
      })
    }, 2000);
    // ^ Since we're using jest.useFakeTimers(), we can fast-forward
    //   to the Promise being resolved with jest.runAllTimers()
  });
  sinon.stub(window, 'sendMessageToActiveTab').returns(delayedPromise);
  const netflixCaptionRequest = 'https://ipv4-c009-bos001-ix.1.oca.nflxvideo.net/?o=AQGEcOavLssMXe3YasJMNARs9BDCrMSrUV_ZwavCYGePyLsYfOgBIxlr9R80J9lBBNKyghiifjNOnjd9LMuRg93_wXPlUhhR1fXXxJVCMWQZR0wWpsbQZzrbIm4yxStAvXkuTZbm_GI0Bvjc-jYbEeZNprLvcpq-7ouKyvi7lm9WNnx9tCfQgraLN8ndOQDOacv4fDr7-RAHzh1c-3veZNn4eA&v=3&e=1536283465&t=SGlFE7VQbMfhRqbODJy-Bh1gud';

  /**
   *  1. Intercept a Netflix caption request
   */
  background._onBeforeNetflixCaptionRequest({
    url: netflixCaptionRequest
  });
  // Expect that we told the active tab about it
  expect(window.sendMessageToActiveTab.callCount).toEqual(1);
  // Expect that it was added to netflixCaptionRequestsInFlight
  expect(window.netflixCaptionRequestsInFlight).toEqual({[netflixCaptionRequest]: 1});
  // Reset window.sendMessageToActiveTab
  window.sendMessageToActiveTab.resetHistory();

  /**
   *  2. The active tab does a replay, but it shouldn't be acted on.
   */

   // Replay
   background._onBeforeNetflixCaptionRequest({
     url: netflixCaptionRequest
   });
   // We shouldn't had sent any message about it, because it's in flight.
   expect(window.sendMessageToActiveTab.callCount).toEqual(0);


   /**
    *  3. The replay finishes
    */

   // Fast-forward the delayedPromise
   jest.runAllTimers();
});
