import React from 'react';
import { css } from 'emotion';
import Toggle from 'react-toggle';

import 'react-toggle/style.css';

const wrapper = css`
  width: 280px;
  height: 600px;
  background: white;
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
`;

const controlWrapper = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #aaa;
  padding: 8px;
  height: 32px;

  &:first-child {
    border-top: 1px solid #aaa;
  }
`;

const controlLabel = css`
  font-size: 12px;
  line-height: 12px;
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
    <div className={controls}>
      <div className={controlWrapper}>
        <div className={controlLabel}>On</div>
        <Toggle />
      </div>
      <div className={controlWrapper}>
        <div className={controlLabel}>Second Subtitle Language</div>
        <div className={controlLabel}>None loaded ?</div>
      </div>
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
);

export default MainPage;
