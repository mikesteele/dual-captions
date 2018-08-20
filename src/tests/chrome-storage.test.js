import expect from 'expect';
import sinon from 'sinon';

// Create store
import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducer';
import ReduxThunk from 'redux-thunk';
import * as actions from '../actions';
import chromeMock from './chrome-mock';

const store = createStore(reducer,
  applyMiddleware(
    ReduxThunk
  )
);

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

const observer = window.DC.DUAL_CAPTIONS;


/**

Sanity tests for observer - can be removed when observer has proper tests.

**/

it('observer should have secondLanguage = "en" in state by default', done => {
  observer._onMessage({
    type: 'get-state'
  }, null, response => {
    expect(response.secondLanguage).toEqual('en');
    done();
  });
});

it('observer should have settingsAreDefault in state by default', done => {
  observer._onMessage({
    type: 'get-state'
  }, null, response => {
    expect(response.settingsAreDefault).toEqual(true);
    done();
  });
});

/**

Action tests

**/

/**

TODO

Actions to-be-renamed:

actions.determineSettings()

it('should use DC if settings arent default', done => {
  observer.settingsAreDefault = false;
  actions.determineSettings()
});

**/
