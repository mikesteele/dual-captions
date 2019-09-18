import { h, Component } from 'preact';

class IsOn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false
    }
    this.onMessage = this.onMessage.bind(this);
  }

  componentDidMount() {
    if (global.chrome && global.chrome.runtime && global.chrome.runtime.onMessage) {
      global.chrome.runtime.onMessage.addListener(this.onMessage);
    }
  }

  componentWillUnmount() {
    if (global.chrome && global.chrome.runtime && global.chrome.runtime.onMessage) {
      global.chrome.runtime.onMessage.removeListener(this.onMessage);
    }
  }

  onMessage(message, sender, sendResponse) {
    if (!message.type) return;
    switch (message.type) {
      case 'is-on':
      sendResponse({
        ok: true,
        isOn: this.state.isOn
      });
      break;

      case 'start-observer':
      // TODO - Rename this message.type to 'turn-on'
      this.setState({
        isOn: true
      });
      sendResponse({
        ok: true
      });
      break;

      case 'stop-observer':
      // TODO - Rename this message.type to 'turn-off'
      this.setState({
        isOn: false
      });
      sendResponse({
        ok: true
      });
      break;
    }
  }

  render() {
    return this.props.children[0](this.state.isOn);
  }
}

export default IsOn;
