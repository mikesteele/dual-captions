import React from 'react';

const MoveCaptionWindowStyles = props => {
  const { adapter } = props;
  let additionalRules = '';
  let transformAmount = '-80px';
  if (adapter && adapter.moveCaptionWindowRelative) {
    transformAmount = '-120%';
  }
  if (adapter && adapter.moveCaptionWindowAdditionalRules) {
    additionalRules = adapter.moveCaptionWindowAdditionalRules.join('');
  }
  if (adapter && adapter.moveCaptionWindowSelectors) {
    let styles = '';
    adapter.moveCaptionWindowSelectors.forEach(selector => {
      const style = `
        ${selector} {
          transform: translateY(${transformAmount});
          ${additionalRules}
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
