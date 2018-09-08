import assert from 'assert';
import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducer';
import ReduxThunk from 'redux-thunk';
import * as actions from '../actions';
import chromeMock from './chrome-mock';

import '../../public/content-scripts/test/adapter-with-error';

const store = createStore(reducer,
  applyMiddleware(
    ReduxThunk
  )
);

it('should throw no-player error on on turnDCOn', (done) => {
  console.log('TEST: should throw no-player error on on turnDCOn');
  store.dispatch(actions.turnDCOn())
    .then(() => {
      assert(window.DC.observer.isOn === false);
      const state = store.getState();
      assert(state.isOn === false);
      assert(state.hasError === true);
      assert(state.errorType === 'no-player');
      done();
    });
});
