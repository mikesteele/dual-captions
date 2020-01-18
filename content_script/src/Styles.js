import React from 'react'

const Styles = () => {
  const styles = `
    .dc-popper {
      pointer-events: none;
      z-index: 10000;
    }

    .extra-space {
      margin-top: 16px;
    }

    .dc-button:active {
      filter: brightness(0.5);
    }
  `;
  return (
    <style>{styles}</style>
  );
}

export default Styles;
