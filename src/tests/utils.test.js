import expect from 'expect';
import './chrome-mock';
import { ChromeStorageMock } from './chrome-mock';
import * as chromeUtils from '../utils/chrome';

beforeEach(() => {
  window.chrome.storage.local = new ChromeStorageMock();
});

it('getSavedStore should return undefined if no saved store', done => {
  chromeUtils.getSavedStore()
    .then(savedStore => {
      expect(savedStore).toEqual(undefined);
      done();
    })
    .catch(err => {
      console.log(err);
    });
});

it('getSavedStore should return saved store', done => {
  const mockStore = {
    secondLanguage: 'it'
  };
  window.chrome.storage.local.set('__DC_store__', JSON.stringify(mockStore));
  // FIXME ^ This should use an export of storageMiddleware
  chromeUtils.getSavedStore()
    .then(savedStore => {
      expect(savedStore).toEqual(mockStore);
      done();
    })
    .catch(err => {
      console.log(err);
    });
});

it('getSavedStore should handle bad saved store', done => {
  window.chrome.storage.local.set('__DC_store__', `
    {
      "bad-json: "This is invalid JSON
    }
  `);
  chromeUtils.getSavedStore()
    .then(savedStore => {
      expect(savedStore).toEqual(undefined);
      done();
    })
    .catch(err => {
      console.log(err);
    });
});
