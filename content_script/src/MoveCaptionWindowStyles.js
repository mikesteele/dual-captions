import React from 'react';

const MoveCaptionWindowStyles = props => {
  const { adapter } = props;
  if (adapter && adapter.moveCaptionWindowSelector) {
    const styles = `
      ${adapter.moveCaptionWindowSelector} {
        transform: translateY(-120%);
      }
    `;
    return (
      <style>{styles}</style>
    );
  } else {
    return null;
  }
};

export default MoveCaptionWindowStyles;
