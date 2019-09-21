import React from 'react';

const Fade = props => (
  <div
    style={{
      filter: props.in ? 'opacity(1)' : 'opacity(0)',
      transition: 'filter 200ms',
      pointerEvents: props.in ? 'auto' : 'none',
    }}
  >
    { props.children }
  </div>
);

export default Fade;
