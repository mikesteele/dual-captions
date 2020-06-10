import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { MainPage } from '../MainPage.jsx';

let wrapper;
const dispatchSpy = sinon.spy();

beforeEach(() => {
  wrapper = mount(
    <MainPage
      t={key => key}
      isOn={false}
      secondLanguage={'en'}
      loadedLanguages={[]}
      dispatch={dispatchSpy}
    />
  );
});

afterEach(() => {
  dispatchSpy.resetHistory();
});

describe('<MainPage />', () => {
  it('should dispatch turnDCOn / turnDCOff on toggle changed', () => {
    wrapper.find('.react-toggle-screenreader-only').simulate('change');
    expect(dispatchSpy.called).to.be.true;
  });

  it('should dispatch changeDCLanguage on second language select changed', () => {
    wrapper.find('.react-toggle-screenreader-only').simulate('change');
    expect(dispatchSpy.called).to.be.true;
  });
});
