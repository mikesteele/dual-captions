import React from 'react';
import { connect } from 'react-redux';
const translate = require('dual-captions-translations').translate;

const localize = WrappedComponent => props => {
  const t = key => translate(props.uiLanguage, key);
  return (
    <WrappedComponent {...props} t={t} />
  );
};

const connectAndLocalize = WrappedComponent => (
  connect(state => ({...state}))(localize(WrappedComponent))
);

export default connectAndLocalize;
