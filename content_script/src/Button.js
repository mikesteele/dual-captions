import React from 'react';

const Button = props => {
  const style = {
    backgroundColor: '#bb86fc',
    color: 'white',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    transition: '200ms',
    display: 'inline-block',
    padding: '16px',
    borderRadius: '4px',
    margin: '8px',
    ...props.additionalStyles
  }

  if (props.disabled) {
    style.filter = 'brightness(0.5)';
  }

  return (
    <div
      class='dc-button'
      style={style}
      onClick={props.onClick}
    >
      { props.children }
    </div>
  )
};

export default Button;
