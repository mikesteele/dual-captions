import expect from 'expect';
import './chrome-mock';
import { ChromeStorageMock } from './chrome-mock';

beforeEach(() => {
  window.chrome.storage.local = new ChromeStorageMock();
});

it('should get be able to set values in chrome.storage.local', () => {
  window.chrome.storage.local.set('test', 'test value');
  expect(window.chrome.storage.local.mockStorage.test).toEqual('test value');
});


it('should get be able to get values from chrome.storage.local', done => {
  window.chrome.storage.local.mockStorage.whatever = 'test value';
  window.chrome.storage.local.get('whatever', (result) => {
    expect(result).toEqual({
      whatever: 'test value'
    });
    done();
  });
});

it('should get be able to set and get values from chrome.storage.local', done => {
  window.chrome.storage.local.set('test-key', 'test value');
  window.chrome.storage.local.get('test-key', (result) => {
    expect(result).toEqual({
      'test-key': 'test value'
    });
    done();
  });
});

it('should return {} if key doesn\'t exist in chrome.storage.local', done => {
  window.chrome.storage.local.get('test-key-2', (result) => {
    expect(result).toEqual({});
    done();
  });
});
