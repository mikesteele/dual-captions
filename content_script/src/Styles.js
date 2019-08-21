import React from 'react'

const Styles = () => {
  const styles = `
    .dc-window {
      position: absolute;
      z-index: 10000;
    }

    .extra-space {
      margin-top: 16px;
    }
  `;
  return (
    <style>{styles}</style>
  );
}

export default Styles;
