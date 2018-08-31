import assert from 'assert';
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

it('should change DC secondLanguage on changeDCLanguage', (done) => {
  console.log('TEST: should change DC secondLanguage on changeDCLanguage');
  store.dispatch(actions.changeDCLanguage('fr'))
    .then(() => {
      assert(window.DC.DUAL_CAPTIONS.secondLanguage === 'fr');
      const state = store.getState();
      assert(state.secondLanguage === 'fr');
      done();
    });
});

it('should turn DC on on turnDCOn', (done) => {
  console.log('TEST: should turn DC on on turnDCOn');
  store.dispatch(actions.turnDCOn())
    .then(() => {
      assert(window.DC.DUAL_CAPTIONS.isOn === true);
      const state = store.getState();
      assert(state.isOn === true);
      done();
    });
});

it('should turn DC off on turnDCOff', (done) => {
  console.log('TEST: should turn DC off on turnDCOff');
  store.dispatch(actions.turnDCOff())
    .then(() => {
      assert(window.DC.DUAL_CAPTIONS.isOn === false);
      const state = store.getState();
      assert(state.isOn === false);
      done();
    });
});

it('should apply settings on applyDCSettings', (done) => {
  console.log('TEST: should apply settings on applyDCSettings');
  store.dispatch({
    type: 'CHANGE_SETTINGS',
    payload: {
      extraSpace: true
    }
  });
  // TODO - Why aren't these part of the same thunk?
  store.dispatch(actions.applyDCSettings())
    .then(() => {
      assert(window.DC.DUAL_CAPTIONS.extraSpace === true);
      done();
    });
});
