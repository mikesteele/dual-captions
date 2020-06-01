import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import reducer from './reducer';
import ReduxThunk from 'redux-thunk';
import { loggingMiddleware, storageMiddleware } from './middleware';

const store = createStore(reducer,
  applyMiddleware(
    ReduxThunk,
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
