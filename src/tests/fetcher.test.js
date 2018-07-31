import expect from 'expect';
import sinon from 'sinon';

import './chrome-mock';
import '../../public/content-scripts/init/fetcher';

const fetcher = new window.TranslationFetcher();

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

beforeEach(() => {
  chromeSendMessageResponse = {
    ok: true,
    captionRequestUrls: captionRequestUrls
  }
  captionRequestUrls = {
    youtube: {}
  }
});

it('should get captionRequestUrls from background', done => {
  fetcher.askBackgroundForCaptionRequestUrls()
    .then(urls => {
      expect(urls).toEqual(captionRequestUrls);
      done();
    })
    .catch(err => {
      console.log(err);
    })
});

it('should gracefully handle bad response from background', done => {
  chromeSendMessageResponse = {};
  fetcher.askBackgroundForCaptionRequestUrls()
    .then()
    .catch(err => {
      expect(err).toEqual(`Couldn't get captionRequestUrls from the background.`);
      done();
    })
});

it('should gracefully handle no response from background', done => {
  chromeSendMessageResponse = undefined;
  fetcher.askBackgroundForCaptionRequestUrls()
    .then()
    .catch(err => {
      expect(err).toEqual(`Couldn't get captionRequestUrls from the background.`);
      done();
    })
});
