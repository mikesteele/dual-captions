import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { ErrorPage } from '../ErrorPage.jsx';

let wrapper;
const dispatchSpy = sinon.spy();

beforeEach(() => {
  wrapper = mount(
    <ErrorPage
      t={key => key}
      hasError={false}
      errorType={''}
      dispatch={dispatchSpy}
    />
  );
});

afterEach(() => {
  dispatchSpy.resetHistory();
});

describe('<ErrorPage />', () => {
  it('should dismiss error on click X', () => {
    wrapper.find('.dismiss-icon').simulate('click');
    expect(dispatchSpy.called).to.be.true;
  });
});
