import expect from 'expect';
import sinon from 'sinon';
import exampleFetch from './assets/youtube/fetch';
import exampleResult from './assets/youtube/result';

import './chrome-mock';
import '../../public/content-scripts/init/fetcher';
import '../../public/content-scripts/youtube/fetcher';

const fetcher = window.DC.fetcher;
const exampleVideoId = '4INdeZ5HYpw';

let captionRequestUrls = {
  youtube: {}
}

let chromeSendMessageResponse = {
  ok: true,
  captionRequestUrls: captionRequestUrls
}

window.chrome.runtime.sendMessage = (details, callback) => {
  callback(chromeSendMessageResponse);
};

let fetchResponse = exampleFetch;
window.fetch = sinon.stub().returns(Promise.resolve({
  text: () => {
    return fetchResponse;
  }
}));

beforeEach(() => {
  captionRequestUrls.youtube = {};
  window.fetch.resetHistory();
  chromeSendMessageResponse = {
    ok: true,
    captionRequestUrls: captionRequestUrls
  }
});

it('should handle no captions for this video', (done) => {
  fetcher.fetchCaptions('en', 'some-video-id')
    .then()
    .catch(err => {
      expect(err).toEqual('No caption request URL found for this video. Has the user turned on captions?');
      done();
    });
});

it('should fetch if there is a captionRequestUrl', (done) => {
  captionRequestUrls.youtube[exampleVideoId] = 'https://fake';
  fetcher.fetchCaptions('en', exampleVideoId)
    .then(response => {
      expect(response).toEqual(exampleFetch);
      done();
    })
    .catch();
});

it('should reject if response is empty', (done) => {
  captionRequestUrls.youtube[exampleVideoId] = 'https://fake';
  fetchResponse = '';
  fetcher.fetchCaptions('en', exampleVideoId)
    .then()
    .catch(err => {
      expect(err).toEqual('No captions available for this language');
      done();
    });
});
