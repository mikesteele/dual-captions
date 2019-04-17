import './chrome-mock';
import '../../public/content-scripts/init/translation-queue';

import { expect } from 'chai';
import sinon from 'sinon';

const queue = window.DC.translationQueue;
// Stubbing out these two methods that send messages to the background page
sinon.stub(queue, 'setIconToNormal');
sinon.stub(queue, 'setIconToHasNotification');

const wait = (amount) => new Promise(resolve => setTimeout(resolve, amount));

beforeEach(() => {
  queue._queue = [];
  queue.setIconToNormal.resetHistory();
  queue.setIconToHasNotification.resetHistory();
});

it('should pass integration test', done => {
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

  // The popup should be requesting the up-to-date queue via 'get-queue' on an interval
  queue.onMessage({
    type: 'get-queue'
  }, null, response => {
    expect(response.ok).to.be.true;
    expect(response.payload[0].text).to.equal('Some test string');
    expect(response.payload[0].isResolved).to.be.false;

    // Sanity test: the addToQueue promise should still be pending
    expect(successStub.called).to.be.false;
    expect(failureStub.called).to.be.false;

    // The popup will resolve this request like so:
    queue.onMessage({
      type: 'resolve-translation',
      payload: {
        text: 'Some test string',
        language: 'en'
      }
    }, null, response => {
      expect(response.ok).to.be.true;

      // ^ Scroll up the successStub callback...
    });
  });
});

it('should handle trying to re-add same request to the queue', done => {
  const onCatch = err => { throw new Error(err) };

  const stub1 = sinon.stub();
  const stub2 = sinon.stub();
  const stub3 = sinon.stub();

  // Request the same string 3 times
  queue.addToQueue('test').then(stub1).catch(onCatch);
  queue.addToQueue('test').then(stub2).catch(onCatch);
  queue.addToQueue('test').then(stub3).catch(onCatch);

  // Should only have one request in queue
  expect(queue._queue.length).to.equal(1);

  // Simulate resolving it
  queue.onMessage({
    type: 'resolve-translation',
    payload: {
      text: 'test',
      language: 'jp'
    }
  }, null, response => {
    wait(100).then(() => {
      // It should've called all three stubs by now.
      expect(stub1.calledWith('jp')).to.be.true;
      expect(stub2.calledWith('jp')).to.be.true;
      expect(stub3.calledWith('jp')).to.be.true;

      // And when we request 'test' again, we should get a cached result
      queue.addToQueue('test').then(language => {
        expect(language).to.equal('jp');
        done();
      }).catch(onCatch);
    });
  });
});
