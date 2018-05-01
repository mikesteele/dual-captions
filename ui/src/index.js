import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import './i18n';
import reducer from './reducer';
import { storageMiddleware, i18nMiddleware } from './middleware';

const store = createStore(reducer,
  applyMiddleware(storageMiddleware, i18nMiddleware)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
