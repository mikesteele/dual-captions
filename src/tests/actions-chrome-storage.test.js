import expect from 'expect';
import sinon from 'sinon';

// Create store
import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducer';
import ReduxThunk from 'redux-thunk';
import * as actions from '../actions';
import chromeMock from './chrome-mock';
import config from '../config';

let store;
let defaultStore;

// Create window.DC
import '../../public/content-scripts/init';
// Create adapter
import '../../public/content-scripts/config/init';
// Creater fetcher
import '../../public/content-scripts/init/fetcher';
// Create parser
import '../../public/content-scripts/init/parser';
// Create provider
import '../../public/content-scripts/init/provider';
// Create observer
import './chrome-mock';
import '../../public/content-scripts/dual-captions';

import { ChromeStorageMock } from './chrome-mock';

let observer = window.DC.DUAL_CAPTIONS;

beforeEach(() => {
  // Reset chrome.storage
  window.chrome.storage.local = new ChromeStorageMock();

  // Reset store
  store = createStore(reducer,
    applyMiddleware(
      ReduxThunk
    )
  );
  defaultStore = {...store.getState()};
});

/**

Sanity tests for observer - can be removed when observer has proper tests.

**/

it(`
  observer should have in state, by default:
  - secondLanguage = "en"
  - settingsAreDefault = true
  `, done => {
  observer._onMessage({
    type: 'get-state'
  }, null, response => {
    expect(response.secondLanguage).toEqual('en');
    expect(response.settingsAreDefault).toEqual(true);
    done();
  });
});

/**

Action tests

**/

it(`
  When:
  - DC settings are default
  - No saved store

  It should:
  - It should use the default settings in config module
  `, done => {
  store.dispatch(actions.determineState())
    .then(() => {
      const state = store.getState();
      expect(state.secondLanguage).toEqual(config.defaultSecondLanguage);
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});

it(`
  When:
  - DC settings aren't default
  - No saved store

  It should:
  - It should use DC settings
  `, done => {
  observer.settingsAreDefault = false;
  observer.secondLanguage = 'it';
  // Sanity test
  expect(observer.secondLanguage !== config.defaultSecondLanguage).toEqual(true);
  store.dispatch(actions.determineState())
    .then(() => {
      const state = store.getState();
      expect(state.secondLanguage).toEqual('it');
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});

it(`
  When:
  - DC settings aren't default
  - There is a saved store

  It should
  - It should still use DC settings
  `, done => {
  // DC settings aren't default
  observer.settingsAreDefault = false;
  observer.secondLanguage = 'es';

  // There is a saved store
  const mockStore = {
    ...defaultStore,
    secondLanguage: 'it'
  };
  window.chrome.storage.local.set('__DC_store__', JSON.stringify(mockStore));
  // FIXME ^ This should use an export of storageMiddleware

  // Sanity tests
  const initialState = store.getState()
  expect(initialState.secondLanguage !== 'es').toEqual(true);

  // Test action
  store.dispatch(actions.determineState())
    .then(() => {
      const state = store.getState();
      expect(state.secondLanguage).toEqual('es');
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});


it(`
  When:
  - DC settings are default
  - There is a saved store

  It should:
  - It should use settings from saved store
  - It should inject settings into DC
  `, done => {
  // DC settings are default
  observer.settingsAreDefault = true;

  // There is a saved store
  const mockStore = {
    ...defaultStore,
    settings: {
      ...defaultStore.settings,
      extraSpace: true
    }
  };
  window.chrome.storage.local.set('__DC_store__', JSON.stringify(mockStore));
  // FIXME ^ This should use an export of storageMiddleware

  // Sanity tests
  const initialState = store.getState();
  expect(initialState.settings.extraSpace !== true).toEqual(true);
  expect(observer.extraSpace !== true).toEqual(true);

  // Test action
  store.dispatch(actions.determineState())
    .then(() => {
      const state = store.getState();
      // It should use settings from saved store
      expect(state.settings.extraSpace).toEqual(true);

      // It should inject settings into DC
      expect(observer.extraSpace).toEqual(true);
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});

it(`
  When:
  - DC settings are default
  - There is a saved store

  It should:
  - It should copy all saved store settings to state
  - It should copy all saved store settings to DC
  `, done => {
  // FUTURE - This can be removed when observer is reset in beforeEach
  observer.extraSpace = false;

  // DC settings are default
  observer.settingsAreDefault = true;

  // There is a saved store
  const mockStore = {
    ...defaultStore,
    secondLanguage: 'ja',
    uiLanguage: 'fr',
    settings: {
      ...defaultStore.settings,
      useCaptionsFromVideo: false,
      delayRenderingUntilTranslation: false,
      extraSpace: true
    }
  };
  window.chrome.storage.local.set('__DC_store__', JSON.stringify(mockStore));
  // FIXME ^ This should use an export of storageMiddleware

  // Initial state sanity tests
  const initialState = store.getState();
  expect(initialState.secondLanguage !== 'ja').toEqual(true);
  expect(initialState.uiLanguage !== 'fr').toEqual(true);
  expect(initialState.settings.extraSpace !== true).toEqual(true);
  expect(initialState.settings.useCaptionsFromVideo !== false).toEqual(true);
  expect(initialState.settings.delayRenderingUntilTranslation !== false).toEqual(true);

  // Observer sanity tests
  expect(observer.secondLanguage !== 'ja').toEqual(true);
  expect(observer.extraSpace !== true).toEqual(true);
  expect(observer.useCaptionsFromVideo !== false).toEqual(true);
  expect(observer.delayRenderingUntilTranslation !== false).toEqual(true);

  // Test action
  store.dispatch(actions.determineState())
    .then(() => {
      const state = store.getState();
      // It should use settings from saved store
      expect(state.secondLanguage).toEqual('ja');
      expect(state.uiLanguage).toEqual('fr');
      expect(state.settings.extraSpace).toEqual(true);
      expect(state.settings.useCaptionsFromVideo).toEqual(false);
      expect(state.settings.delayRenderingUntilTranslation).toEqual(false);

      // It should inject settings into DC
      expect(observer.secondLanguage).toEqual('ja');
      expect(observer.extraSpace).toEqual(true);
      expect(observer.useCaptionsFromVideo).toEqual(false);
      expect(observer.delayRenderingUntilTranslation).toEqual(false);
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});

it(`
  When:
  - DC settings are default
  - There is a saved store

  It should:
  - It should get UI language from saved store
  `, done => {
  // DC settings are default
  observer.settingsAreDefault = true;

  // There is a saved store
  const mockStore = {
    ...defaultStore,
    uiLanguage: 'fr'
  };
  window.chrome.storage.local.set('__DC_store__', JSON.stringify(mockStore));
  // FIXME ^ This should use an export of storageMiddleware

  // Sanity tests
  const initialState = store.getState();
  expect(initialState.uiLanguage !== 'fr').toEqual(true);

  // Test action
  store.dispatch(actions.determineState())
    .then(() => {
      const state = store.getState();
      // It should use UI language from saved store
      expect(state.uiLanguage).toEqual('fr');
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});

it(`
  When:
  - DC settings aren't default
  - There is a saved store

  It should:
  - It should get UI language from saved store
  `, done => {
  // DC settings aren't default
  observer.settingsAreDefault = false;
  observer.uiLanguage = 'it';
  // ^ This setting isn't expected in the observer, so it should be ignored.

  // There is a saved store
  const mockStore = {
    ...defaultStore,
    uiLanguage: 'fr'
  };
  window.chrome.storage.local.set('__DC_store__', JSON.stringify(mockStore));
  // FIXME ^ This should use an export of storageMiddleware

  // Sanity tests
  const initialState = store.getState();
  expect(initialState.uiLanguage !== 'fr').toEqual(true);

  // Test action
  store.dispatch(actions.determineState())
    .then(() => {
      const state = store.getState();
      // It should use UI language from saved store
      expect(state.uiLanguage).toEqual('fr');
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});

it(`
  When:
  - DC settings aren't default
  - There is a saved store

  It should:
  - It should get UI language from saved store
  `, done => {
  // DC settings aren't default
  observer.settingsAreDefault = false;
  observer.uiLanguage = 'it';
  // ^ This setting isn't expected in the observer, so it should be ignored.

  // There is a saved store
  const mockStore = {
    ...defaultStore,
    uiLanguage: 'fr'
  };
  window.chrome.storage.local.set('__DC_store__', JSON.stringify(mockStore));
  // FIXME ^ This should use an export of storageMiddleware

  // Sanity tests
  const initialState = store.getState();
  expect(initialState.uiLanguage !== 'fr').toEqual(true);

  // Test action
  store.dispatch(actions.determineState())
    .then(() => {
      const state = store.getState();
      // It should use UI language from saved store
      expect(state.uiLanguage).toEqual('fr');
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});

it(`
  When:
  - DC settings are default & DC is on
  - There is a saved store

  It should:
  - It should detect correctly that DC is on
  `, done => {
  // DC settings are default
  observer.settingsAreDefault = true;
  observer.isOn = true;

  // There is a saved store
  const mockStore = {
    ...defaultStore,
    isOn: false // This should be ignored if in saved store
  };
  window.chrome.storage.local.set('__DC_store__', JSON.stringify(mockStore));
  // FIXME ^ This should use an export of storageMiddleware

  // Sanity tests
  const initialState = store.getState();
  expect(initialState.isOn).toEqual(false);

  // Test action
  store.dispatch(actions.determineState())
    .then(() => {
      const state = store.getState();
      // It should use isOn from DC
      expect(state.isOn).toEqual(true);
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});

it(`
  When:
  - DC settings are default & DC is off
  - There is a saved store

  It should:
  - It should detect correctly that DC is off
  `, done => {
  // DC settings are default
  observer.settingsAreDefault = true;
  observer.isOn = false;

  // There is a saved store
  const mockStore = {
    ...defaultStore,
    isOn: true // This should be ignored if in saved store
  };
  window.chrome.storage.local.set('__DC_store__', JSON.stringify(mockStore));
  // FIXME ^ This should use an export of storageMiddleware

  // Sanity tests
  const initialState = store.getState();
  expect(initialState.isOn).toEqual(false);

  // Test action
  store.dispatch(actions.determineState())
    .then(() => {
      const state = store.getState();
      // It should use isOn from DC
      expect(state.isOn).toEqual(false);
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});

it(`
  When:
  - There is a saved store

  It should:
  - It should not copy over hasError or errorType
  `, done => {
  // There is a saved store
  const mockStore = {
    ...defaultStore,
    hasError: true, // This should be ignored if in saved store
    errorType: 'image-subtitles' // This should be ignored if in saved store
  };
  window.chrome.storage.local.set('__DC_store__', JSON.stringify(mockStore));
  // FIXME ^ This should use an export of storageMiddleware

  // Sanity tests
  const initialState = store.getState();
  expect(initialState.hasError).toEqual(false);
  expect(initialState.errorType).toEqual('');

  // Test action
  store.dispatch(actions.determineState())
    .then(() => {
      const state = store.getState();
      expect(state.hasError).toEqual(false);
      expect(state.errorType).toEqual('');
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});
