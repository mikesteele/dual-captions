import { css } from 'emotion';

const Wrapper = css`
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 10;

  .react-toggle--checked .react-toggle-track {
    background-color: pink;
  }


  .react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {
    background-color: pink;
  }

  .react-toggle--checked .react-toggle-thumb {
    left: 27px;
    border-color: pink;
  }
`;

const s = {
  Wrapper
}

export default s;
