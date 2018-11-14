import expect from 'expect';
import sinon from 'sinon';

// Create window.DC
import '../../public/content-scripts/init/init';
// Create adapter
import '../../public/content-scripts/init/adapter';
import '../../public/content-scripts/netflix/adapter'; // FIXME - Use initial adapter
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
const adapter  = window.DC.adapter;

it('should have settingsAreDefault by default', () => {
  expect(observer.settingsAreDefault).toEqual(true);
});

/**
 *  Message tests
 */

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

it('should respond correctly to change-language', done => {
  // Sanity test
  expect(observer.secondLanguage === 'jp').toEqual(false);

  observer._onMessage({
    type: 'change-language',
    payload: 'jp'
  }, null, response => {
    expect(observer.secondLanguage === 'jp').toEqual(true);
    expect(response).toEqual({ok: true});
    done();
  });
});

it('should respond correctly to change-settings', done => {
  // Sanity tests
  expect(observer.extraSpace).toEqual(false);
  expect(observer.delayRenderingUntilTranslation).toEqual(true);
  expect(observer.useCaptionsFromVideo).toEqual(true);
  expect(observer.settingsAreDefault).toEqual(true);

  const newSettings = {
    extraSpace: true,
    delayRenderingUntilTranslation: false,
    useCaptionsFromVideo: false
  }

  observer._onMessage({
    type: 'change-settings',
    payload: newSettings
  }, null, response => {
    expect(observer.extraSpace).toEqual(true);
    expect(observer.delayRenderingUntilTranslation).toEqual(false);
    expect(observer.useCaptionsFromVideo).toEqual(false);
    expect(observer.settingsAreDefault).toEqual(false);
    expect(response).toEqual({ok: true});
    done();
  });
});

it('should respond correctly to detect-site', done => {
  observer._onMessage({
    type: 'detect-site'
  }, null, response => {
    expect(response).toEqual({
      ok: true,
      site: adapter.site
    });
    done();
  });
});

it('should respond correctly to get-state', done => {
  observer._onMessage({
    type: 'get-state'
  }, null, response => {
    expect(response).toEqual({
      ok: true,
      settingsAreDefault: observer.settingsAreDefault,
      isOn: observer.isOn,
      secondLanguage: observer.secondLanguage,
      settings: {
        extraSpace: observer.extraSpace,
        useCaptionsFromVideo: observer.useCaptionsFromVideo,
        delayRenderingUntilTranslation: observer.delayRenderingUntilTranslation
      },
      loadedLanguages: []
    });
    done();
  });
});

it('should respond correctly to get-language', done => {
  observer._onMessage({
    type: 'get-language'
  }, null, response => {
    expect(response).toEqual({
      ok: true,
      secondLanguage: observer.secondLanguage
    });
    done();
  });
});

it('should respond correctly to is-on', done => {
  observer._onMessage({
    type: 'is-on'
  }, null, response => {
    expect(response).toEqual({
      ok: true,
      isOn: observer.isOn
    });
    done();
  });
});

it('should respond correctly to start-observer', done => {
  sinon.stub(observer.observer, 'observe');

  observer._onMessage({
    type: 'start-observer'
  }, null, response => {
    expect(observer.observer.observe.called);
    expect(response).toEqual({ ok: true });
    observer.observer.observe.restore();
    done();
  });
});

it('should respond correctly to stop-observer', done => {
  sinon.stub(observer.observer, 'disconnect');

  observer._onMessage({
    type: 'stop-observer'
  }, null, response => {
    expect(observer.observer.disconnect.called);
    expect(response).toEqual({ ok: true });
    observer.observer.disconnect.restore();
    done();
  });
});

/**
 *  Mutation tests
 */


// Stubs

// Adapter
sinon.stub(adapter, 'captionWasAdded').returns(false);
sinon.stub(adapter, 'getNewCaption');
sinon.stub(adapter, 'getNewCaptionOrder').returns(123);
sinon.stub(adapter, 'getPlayerCurrentTime').returns(123);
sinon.stub(adapter, 'styleCaptionElement').returnsArg(0);
sinon.stub(adapter, 'appendToDOM');

// Provider
sinon.stub(provider, 'translate').returns(Promise.resolve({
  text: 'This is a test.'
}));

it(`should do nothing on mutation if mutation doesn't mean caption was added`, () => {
  // Stubs
  adapter.captionWasAdded.resetHistory();
  adapter.getNewCaption.resetHistory();
  adapter.getNewCaptionOrder.resetHistory();
  adapter.getPlayerCurrentTime.resetHistory();
  provider.translate.resetHistory();
  adapter.styleCaptionElement.resetHistory();
  adapter.appendToDOM.resetHistory();

  // This mutation doesn't mean a caption was added
  adapter.captionWasAdded.returns(false);

  observer._onMutation([{}]);
  // Should check if caption was added
  expect(adapter.captionWasAdded.called).toEqual(true);
  // Shouldn't try to get the new caption from the mutation
  expect(adapter.getNewCaption.called).toEqual(false);
  // Shouldn't try to get a new caption order
  expect(adapter.getNewCaptionOrder.called).toEqual(false);
  // Shouldn't try to get the player's current time
  expect(adapter.getPlayerCurrentTime.called).toEqual(false);
  // Shouldn't try to translate
  expect(provider.translate.called).toEqual(false);
  // Shouldn't try to style a new caption
  expect(adapter.styleCaptionElement.called).toEqual(false);
  // Shouldn't append to DOM
  expect(adapter.appendToDOM.called).toEqual(false);
});

it(`should translate & append to DOM if mutation means caption was added`, () => {
  // Stubs
  adapter.captionWasAdded.resetHistory();
  adapter.getNewCaption.resetHistory();
  adapter.getNewCaptionOrder.resetHistory();
  adapter.getPlayerCurrentTime.resetHistory();
  provider.translate.resetHistory();
  adapter.styleCaptionElement.resetHistory();
  adapter.appendToDOM.resetHistory();

  // A caption was added
  adapter.captionWasAdded.returns(true);

  // Mock the new caption
  const testElement = document.createElement('div');
  adapter.getNewCaption.returns(testElement);

  // Mock that translation isn't already in the DOM
  sinon.stub(observer, '_translationIsInDOM').returns(false);

  observer._onMutation([{}]);
  expect(adapter.captionWasAdded.called).toEqual(true);
  expect(adapter.getNewCaption.called).toEqual(true);
  expect(adapter.getNewCaptionOrder.called).toEqual(true);
  expect(adapter.getPlayerCurrentTime.called).toEqual(true);
  expect(provider.translate.called).toEqual(true);
  // TODO - expect(adapter.styleCaptionElement.called).toEqual(true);
  // TODO - expect(adapter.appendToDOM.called).toEqual(true);

  observer._translationIsInDOM.restore();
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
