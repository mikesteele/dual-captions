import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import './chrome-mock';
import { TranslationQueue } from '../components/TranslationRequest.jsx';

import '../../public/content-scripts/init/init';
import '../../public/content-scripts/init/translation-queue';

const dcQueue = window.DC.translationQueue;

const wait = (amount) => new Promise(resolve => setTimeout(resolve, amount));

window.chrome.tabs.sendMessage = (_, message, sendResponse) => {
  dcQueue.onMessage(message, null, sendResponse);
};

const MOCK_QUEUE = [{
  text: 'This is a test.',
  isResolved: false,
  language: undefined,
  callbacks: [sinon.stub(), sinon.stub(), sinon.stub()]
}, {
  text: 'Ça va?',
  isResolved: false,
  language: undefined,
  callbacks: [sinon.stub()]
}, {
  text: 'Ciao!',
  isResolved: true,
  language: 'it',
  callbacks: [sinon.stub()],
}];

// TODO - sinon.useFakeTimers() or jest.useFakeTimers() ?

describe('TranslationQueue', () => {
  it('should pass integration test', done => {
    // Mock queue in DC
    dcQueue._queue = MOCK_QUEUE;

    const translationsMock = key => key;
    const wrapper = mount(<TranslationQueue t={translationsMock} />);
    wrapper.update();

    // Popup requests queue on mount
    wait(200).then(() => {
      wrapper.update();
      // Should render the unresolved requests in MOCK_QUEUE
      expect(wrapper.find('TranslationRequest').find({ text: 'This is a test.' }).length).to.equal(1);
      expect(wrapper.find('TranslationRequest').find({ text: 'Ça va?' }).length).to.equal(1);

      // But none of the resolved ones
      expect(wrapper.find({ children: 'Ciao!' }).length).to.equal(0);

      // Select a language, submit a response
      const ThisIsATestRequest = wrapper.find('TranslationRequest[text="This is a test."]');
      ThisIsATestRequest.find('button').simulate('click');

      wait(200).then(() => {
        // Verify it was resolved in DC
        expect(dcQueue._queue[0].isResolved).to.be.true;
        expect(dcQueue._queue[0].language).to.equal('en');
        dcQueue._queue[0].callbacks.forEach(stub => {
          expect(stub.called).to.be.true;
        });

        // Verify it was resolved in DOM
        wrapper.update();
        expect(wrapper.find('TranslationRequest').find({ text: 'This is a test.' }).length).to.equal(0);
        done();
      });
    });
  });
});
