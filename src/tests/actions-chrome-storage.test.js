import expect from 'expect';
import sinon from 'sinon';

// Create store
import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducer';
import ReduxThunk from 'redux-thunk';
import * as actions from '../actions';
import chromeMock from './chrome-mock';
import config from '../config';

const store = createStore(reducer,
  applyMiddleware(
    ReduxThunk
  )
);

const defaultStore = {...store.getState()};

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
  // TODO
  // TODO - observer = new DualCaptions();
  window.chrome.storage.local = new ChromeStorageMock();
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
    // TODO - expect(response.settingsAreDefault).toEqual(true);
    done();
  });
});

/**

TODO

it('observer should have settingsAreDefault in state by default', done => {
  observer._onMessage({
    type: 'get-state'
  }, null, response => {
    expect(response.settingsAreDefault).toEqual(true);
    done();
  });
});
**/

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

/**

it(`
  - DC settings aren't default
  - Saved store
  - It should still use DC settings
  `, done => {
  store.dispatch(actions.determineSettings())
    .then(() => {
      const state = store.getState();
      expect(state.secondLanguage).toEqual(config.defaultSecondLanguage);
      done();
    }).catch(err => {
      console.log(`Error: ${err}`);
    });
});

**/

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

/**

TODO - Test if all settings are copied over.

TODO - Test for UI settings being saved with/without DC state

**/
