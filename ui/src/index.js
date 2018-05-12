import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import i18n from './i18n';
import reducer from './reducer';
import ReduxThunk from 'redux-thunk';
import { storageMiddleware, i18nMiddleware, loggingMiddleware } from './middleware';
import { I18nextProvider } from 'react-i18next';

const store = createStore(reducer,
  applyMiddleware(
    ReduxThunk,
    storageMiddleware,
    i18nMiddleware,
    loggingMiddleware
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
