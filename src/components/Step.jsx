import React, { Component } from 'react';

// TODO - Make into a functional component

class Step extends Component {
  render() {
    return (
      <div className='container'>
        <div className='step-container'>
          <div className='step-number'>
            <span>{this.props.stepNumber}</span>
          </div>
          <div className='step-content'>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default Step;
