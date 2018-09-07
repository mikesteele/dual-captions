import expect from 'expect';
import sinon from 'sinon';

// Create window.DC
import '../../public/content-scripts/init/init';
// Create adapter
import '../../public/content-scripts/init/adapter';
// Creater fetcher
import '../../public/content-scripts/init/fetcher';
// Create parser
import '../../public/content-scripts/init/parser';
// Create provider
import '../../public/content-scripts/init/provider';
// Create observer
import './chrome-mock';
import '../../public/content-scripts/init/observer';

const observer = window.DC.DUAL_CAPTIONS;
const provider = window.DC.provider;

it('should have settingsAreDefault by default', () => {
  expect(observer.settingsAreDefault).toEqual(true);
});

/**
 *  Message tests
 */

it('should change settingsAreDefault to false once changing settings', done => {
  observer._onMessage({
    type: 'change-settings',
    payload: {}
  }, null, response => {
    expect(observer.settingsAreDefault).toEqual(false);
    done();
  });
});

it('should request secondLanguage onPopupOpened', done => {
  const stub = sinon.stub(provider, 'requestLanguage');
  stub.returns(Promise.resolve());
  observer._onMessage({
    type: 'popup-opened',
    payload: {}
  }, null, response => {
    expect(provider.requestLanguage.calledWith(observer.secondLanguage)).toEqual(true);
    stub.restore();
    done();
  });
});
