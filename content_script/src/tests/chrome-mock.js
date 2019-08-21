import sinon from 'sinon';

window.chrome = {
  webRequest: {
    onBeforeRequest: {
      addListener: sinon.stub()
    }
  },
  tabs: {
    onUpdated: {
      addListener: sinon.stub()
    },
    sendMessage: sinon.stub()
  },
  runtime: {
    sendMessage: sinon.stub(),
    onMessage: {
      addListener: sinon.stub()
    }
  }
}
