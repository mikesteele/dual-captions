import React from 'react';

const Step = (props) => (
  <div className='container'>
    <div className='step-container'>
      <div className='step-number'>
        <span>{props.stepNumber}</span>
      </div>
      <div className='step-content'>
        {props.children}
      </div>
    </div>
  </div>
);

export default Step;
