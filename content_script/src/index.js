import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// TODO - Remove
const API_KEYS = require('dual-captions-api-keys/keys');
console.log(JSON.stringify(API_KEYS))

const dcRoot = document.createElement('div');
dcRoot.setAttribute('__DC-root__', true);
document.body.appendChild(dcRoot);
ReactDOM.render(<App />, dcRoot);
