class Controller {
  constructor() {
    this.settings = {
      secondSubtitleLanguage: 'en'
    };
    this.state = {
      isOn: false
    }

    this.setup = this.setup.bind(this);
    this.shutdown = this.shutdown.bind(this);
    this._canUseTimedRenderer = this._canUseTimedRenderer.bind(this);
    this._onMessage = this._onMessage.bind(this);

    window.chrome.runtime.onMessage.addListener(this._onMessage);;
  }
  setup() {
    const { timedRenderer, mutationRenderer } = window.DC;
    if (this._canUseTimedRenderer()) {
      mutationRenderer.shutdown();
      timedRenderer.setup();
    } else {
      timedRenderer.shutdown();
      mutationRenderer.setup();
    }

    const { observer } = window.DC;
    observer.setup();

    this.state.isOn = true;
  }

  shutdown() {
    const { timedRenderer, mutationRenderer, observer } = window.DC;
    timedRenderer.shutdown();
    mutationRenderer.shutdown();
    observer.shutdown();
    this.state.isOn = false;
  }

  _canUseTimedRenderer() {
    const { provider } = window.DC;
    const loadedLanguages = provider.getLoadedLanguages();
    return loadedLanguages.includes(this.settings.secondSubtitleLanguage);
  }

  _onChangeSecondSubtitleLanguage() {
    // TODO - Don't restart if it's already running
    const { timedRenderer, mutationRenderer } = window.DC;
    if (this._canUseTimedRenderer()) {
      mutationRenderer.shutdown();
      timedRenderer.setup();
    } else {
      timedRenderer.shutdown();
      mutationRenderer.setup();
    }
  }

  _onMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'change-language':
      this.settings.secondSubtitleLanguage = message.payload;
      this._onChangeSecondSubtitleLanguage();
      sendResponse({
        ok: true
      });
      break;

      case 'start-observer':
      // TODO - Change this message type name
      this.setup();
      sendResponse({
        ok: true
      });
      break;

      case 'stop-observer':
      // TODO - Change this message type name
      this.shutdown();
      sendResponse({
        ok: true
      });
      break;
    }
  }
}

window.DC.controller = new Controller();
