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

const observer = window.DC.observer;
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

/**
 *  De-duplication tests
 */

it('should correctly indentify if translation is already in the DOM', () => {
  const queryStub = sinon.stub(document, 'querySelectorAll');
  queryStub.returns([]);
  // No DC captions in the DOM, should return false
  expect(observer._translationIsInDOM('Some example text')).toEqual(false);

  const exampleElement = document.createElement('div');
  exampleElement.innerHTML = `<div class='whatever'>Some example text</div>`;
  let translationsInDOM = [exampleElement];
  queryStub.returns(translationsInDOM);

  // There's a caption in the DOM with the same text content, so it should say true
  expect(observer._translationIsInDOM('Some example text')).toEqual(true);

  // The following is a bit of a redundant test but it came up during Netflix testing
  const caption = `<span xmlns="http://www.w3.org/ns/ttml" style="span">It felt as if my real life</span><br xmlns="http://www.w3.org/ns/ttml"><span xmlns="http://www.w3.org/ns/ttml" style="span">were finally beginning.</span> ✓`;
  const exampleElement2 =  document.createElement('div');
  exampleElement2.innerHTML = caption;
  translationsInDOM = [exampleElement2];
  queryStub.returns(translationsInDOM);
  expect(observer._translationIsInDOM(caption)).toEqual(true);
});
