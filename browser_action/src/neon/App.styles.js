import { css } from 'emotion';

const Wrapper = css`
  width: 300px;
  height: 300px;
  background: black;
  border-radius: 16px;
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  flex-direction: column;
`;

const Heading = css`
  font-size: 24px;
  line-height: 32px;
  margin: 0;
`;

const Subheading = css`
  font-size: 16px;
  line-height: 24px;
  margin: 0;
`;

const s = {
  Heading,
  Subheading,
  Wrapper
}

export default s;
