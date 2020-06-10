import React from 'react';
import { connect } from 'react-redux';
import { switchAppDesign } from '../actions';


const RedesignApp = props => (
  <div>
    I'm the new app!
    <div onClick={() => props.dispatch(switchAppDesign(false))}>Switch back</div>
  </div>
);

export default connect(state => ({...state}))(RedesignApp);
