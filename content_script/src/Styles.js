import React from 'react'

const Styles = () => {
  const styles = `
    .dc-popper {
      z-index: 10000;
    }

    .extra-space {
      margin-top: 16px;
    }

    .action-pane.dc-fade-enter-done {
      filter: opacity(1);
    }

    .action-pane.dc-fade-exit-done {
      filter: opacity(0);
    }

    .action-pane.dc-fade-exit {
      filter: opacity(0);
    }

    .action-pane.dc-fade-enter {
      filter: opacity(1);
    }

    .action-pane {
      transition: filter 1000ms;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 12000;
      /* TODO - Pass pointer events through */
    }

  `;
  return (
    <style>{styles}</style>
  );
}

export default Styles;
