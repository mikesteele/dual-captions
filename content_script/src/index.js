import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const dcRoot = document.createElement('div');
dcRoot.setAttribute('__DC-root__', true);
document.body.appendChild(dcRoot);
ReactDOM.render(<App />, dcRoot);
