class TimedRenderer extends Renderer {
  constructor() {
    super();
    this._onTimeChange = this._onTimeChange.bind(this);
  }

  setup() {
    console.log('TimedRenderer - TimedRenderer setting up...');
    const { adapter } = window.DC;
    const videoElement = adapter.getPlayerVideoElement();
    if (videoElement) {
      videoElement.addEventListener('timeupdate', this._onTimeChange);
    } else {
      // TODO - What should it do if no video element?
    }
  }

  shutdown() {
    console.log('TimedRenderer - TimedRenderer shuting down...');
    const { adapter } = window.DC;
    const videoElement = adapter.getPlayerVideoElement();
    if (videoElement) {
      videoElement.removeEventListener('timeupdate', this._onTimeChange);
    } else {
      // TODO - What should it do if no video element?
    }
  }

  _onTimeChange(e) {
    console.log('TimedRenderer - _onTimeChange called')
    /**
    TODO
    const { provider, observer } = window.DC;
    const captionToRender = provider.findCaptionForTime(e.whatever); // TODO
    // TODO _translationIsInDOM => no underscore
    if (captionToRender && !observer._translationIsInDOM(captionToRender)) {
      // TODO - adapter.render() !!!
      const captionElementToRender = observer.createCaptionElement(captionToRender); // TODO
      adapter.appendToDOM(captionElementToRender);
    }
    **/
  }
}

window.DC.timedRenderer = new TimedRenderer();
