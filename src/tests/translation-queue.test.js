import './chrome-mock';
import '../../public/content-scripts/init/translation-queue';

import { expect } from 'chai';
import sinon from 'sinon';

const queue = window.DC.translationQueue;

it('should pass integration test', done => {
  // Stubbing out these two methods that send messages to the background page
  sinon.stub(queue, 'setIconToNormal');
  sinon.stub(queue, 'setIconToHasNotification');

  // <!> This is the last step of the test, expecting the language the popup returned.
  // You should skip reading this until later.
  const successStub = sinon.stub().callsFake(language => {
    expect(language).to.equal('en');
    expect(queue.setIconToNormal.called).to.be.true;
    done();
  });
  const failureStub = sinon.stub().callsFake(() => {
    throw new Error('Promise should never reject!');
  });

  /**
   *  Start reading the test from here...
   */

  // The Processor will add a pending translation to the queue
  queue.addToQueue('Some test string').then(successStub).catch(failureStub);

  // The queue should add the translation to its queue
  expect(queue._queue.length).to.equal(1);
  expect(queue._queue[0].text).to.equal('Some test string');
  expect(queue._queue[0].isResolved).to.be.false;
  // The queue should change the icon of the popup to show a new notification
  expect(queue.setIconToHasNotification.calledOnce).to.be.true;
  queue.setIconToHasNotification.resetHistory();

  // The popup should be requesting unresolved requests via 'get-unresolved-requests' on an interval
  queue.onMessage({
    type: 'get-unresolved-requests'
  }, null, response => {
    expect(response.ok).to.be.true;
    expect(response.payload[0]).to.deep.equal({
      index: 0,
      text: 'Some test string'
    });

    // Sanity test: the addToQueue promise should still be pending
    expect(successStub.called).to.be.false;
    expect(failureStub.called).to.be.false;

    // The popup will resolve this request like so:
    queue.onMessage({
      type: 'resolve-translation',
      payload: {
        index: 0,
        language: 'en'
      }
    }, null, response => {
      expect(response.ok).to.be.true;

      // ^ Scroll up the successStub callback...
    });
  });
});
