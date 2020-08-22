import React from 'react'

const Styles = () => {
  const styles = `
    .dc-z-index {
      z-index: 10000;
    }

    .dc-no-pointer-events {
      pointer-events: none;
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
