import React from 'react';
import { css } from 'emotion';
import Toggle from 'react-toggle';

import 'react-toggle/style.css';

const wrapper = css`
  width: 300px;
  height: 600px;
  background: #f5f5f9;
`;

const header = css`
  display: flex;
  justify-content: center;
  font-size: 12px;
  line-height: 12px;
  padding: 8px;
`;

const controls = css`
  display: flex;
  flex-direction: column;
  margin: 8px 0;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px;
  border-radius: 8px;

  &:first-child {
    margin: 0;
  }
`;

const controlWrapper = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(221, 221, 221);
  padding: 8px 16px;
  height: 32px;

  &:last-child {
    border-bottom: none;
  }
`;

const controlLabel = css`
  font-size: 14px;
  line-height: 14px;
  padding: 0;
`;

const flexbox = css`
  display: flex;
  justify-content: center;
  align-content: center;
`;

const MainPage = () => (
  <div className={wrapper}>
    <div className={header}>
      Dual Captions v2.1
    </div>
    <div>
      <div className={controls}>
        <div className={controlWrapper}>
          <div className={controlLabel}>On</div>
          <Toggle />
        </div>
      </div>
      <div className={controls}>
        <div className={controlWrapper}>
          <div className={controlLabel}>Second Subtitle Language</div>
          <div className={controlLabel}>No loaded ?</div>
        </div>
      </div>
      <div className={controls}>
        <div className={controlWrapper}>
          <div className={controlLabel}>Space between captions</div>
          <Toggle />
        </div>
        <div className={controlWrapper}>
          <div className={controlLabel}>Custom text color</div>
          <div className={flexbox}>
            Red
            <Toggle />
          </div>
        </div>
        <div className={controlWrapper}>
          <div className={controlLabel}>Small text</div>
          <Toggle />
        </div>
        <div className={controlWrapper}>
          <div className={controlLabel}>Hide action panel</div>
          <Toggle />
        </div>
        <div className={controlWrapper}>
          <div className={controlLabel}>UI Language</div>
          <div className={controlLabel}>English</div>
        </div>
      </div>
    </div>
    <div className={header}>
      Star on GitHub | Switch back to old design
    </div>
  </div>
);

export default MainPage;
