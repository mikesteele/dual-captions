import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { SettingsPage } from '../SettingsPage.jsx';

let wrapper;
const dispatchSpy = sinon.spy();

beforeEach(() => {
  wrapper = mount(
    <SettingsPage
      t={key => key}
      settings={
        {
          extraSpace: false
        }
      }
      dispatch={dispatchSpy}
    />
  );
});

afterEach(() => {
  dispatchSpy.resetHistory();
});

describe('<SettingsPage />', () => {
  it('should dispatch on setting clicked', () => {
    wrapper.find('input').first().simulate('change');
    expect(dispatchSpy.called).to.be.true;
  });
});
