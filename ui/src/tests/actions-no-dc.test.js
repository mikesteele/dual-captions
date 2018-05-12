import assert from 'assert';
import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducer';
import ReduxThunk from 'redux-thunk';
import * as actions from '../actions';
import chromeMock from './chrome-mock';

delete window.DC.DUAL_CAPTIONS;

const store = createStore(reducer,
  applyMiddleware(
    ReduxThunk
  )
);

it('should throw no-dc error on on turnDCOn', (done) => {
  console.log('TEST: should throw no-dc error on on turnDCOn');
  store.dispatch(actions.turnDCOn())
    .then(() => {
      const state = store.getState();
      assert(state.isOn === false);
      assert(state.hasError === true);
      assert(state.errorType === 'no-dc');
      done();
    });
});
