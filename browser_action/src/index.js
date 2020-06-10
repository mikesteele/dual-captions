import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import './legacy/i18n';
import reducer from './reducer';
import ReduxThunk from 'redux-thunk';
import { i18nMiddleware, loggingMiddleware, storageMiddleware } from './middleware';
import 'antd-mobile/dist/antd-mobile.css';

const store = createStore(reducer,
  applyMiddleware(
    ReduxThunk,
    i18nMiddleware,
    loggingMiddleware,
    storageMiddleware
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
