import assert from 'assert';
import reducer from '../reducer.js';

const defaultState = reducer(undefined, {});

it('should change secondLanguage on CHANGE_SECOND_LANGUAGE', () => {
  const action = {
    type: 'CHANGE_SECOND_LANGUAGE',
    payload: 'fr'
  };
  const nextState = reducer(defaultState, action);
  assert(nextState.secondLanguage === 'fr', 'Should change secondLanguage when action has payload');
});

it('should handle missing payload for CHANGE_SECOND_LANGUAGE', () => {
  const action = {
    type: 'CHANGE_SECOND_LANGUAGE'
  };
  const nextState = reducer(defaultState, action);
  assert(nextState.secondLanguage === defaultState.secondLanguage);
});

it('should change isOn on CHANGE_DC_ON', () => {
  const action = {
    type: 'CHANGE_DC_ON',
    payload: true
  };
  const nextState = reducer(defaultState, action);
  assert(nextState.isOn === true);
});

it('should change currentTab on CHANGE_CURRENT_TAB', () => {
  const action = {
    type: 'CHANGE_CURRENT_TAB',
    payload: 2
  };
  const nextState = reducer(defaultState, action);
  assert(nextState.currentTab === 2);
});

it('should change error on CHANGE_ERROR', () => {
  const action = {
    type: 'CHANGE_ERROR',
    payload: {
      hasError: true,
      errorType: 'no-dc'
    }
  };
  const nextState = reducer(defaultState, action);
  assert(nextState.hasError === true && nextState.errorType === 'no-dc');
});

it('should change settings on CHANGE_SETTINGS', () => {
  const action = {
    type: 'CHANGE_SETTINGS',
    payload: {
      extraSpace: true
    }
  };
  const nextState = reducer(defaultState, action);
  assert(nextState.settings.extraSpace === true);
});

it('should change UI language on CHANGE_UI_LANGUAGE', () => {
  const action = {
    type: 'CHANGE_UI_LANGUAGE',
    payload: 'fr'
  };
  const nextState = reducer(defaultState, action);
  assert(nextState.uiLanguage === 'fr');
});

it('should hydrate store on HYDRATE_STORE', () => {
  const dcState = {
    'isOn': true,
    'secondLanguage': 'fr',
    'settings': {
      'extraSpace': true
    }
  };
  const action = {
    type: 'HYDRATE_STORE',
    payload: dcState
  };
  const nextState = reducer(defaultState, action);
  assert(nextState.isOn === true && nextState.secondLanguage === 'fr' && nextState.settings.extraSpace === true);
});
