import { h } from 'preact';

const Styles = () => {
  const styles = `
    .dc-popper {
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
