import React from 'react';

const MoveCaptionWindowStyles = props => {
  const { adapter } = props;
  if (adapter && adapter.moveCaptionWindowSelectors) {
    let styles = '';
    console.log(adapter.moveCaptionWindowSelectors)
    adapter.moveCaptionWindowSelectors.forEach(selector => {
      const style = `
        ${selector} {
          transform: translateY(-80px);
        }
      `;
      styles = styles + style;
    });
    return (
      <style>{styles}</style>
    );
  } else {
    return null;
  }
};

export default MoveCaptionWindowStyles;
