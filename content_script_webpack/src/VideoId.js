import React from 'react';
import { getIntegrationForSite } from './utils/integrations';

class VideoId extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: null
    };
    this.detectVideoId = this.detectVideoId.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  onMessage(message, sender, sendResponse) {
    if (!message.type) return;
    switch (message.type) {
      case 'tab-updated-url':
      this.detectVideoId();
      break;

      default:
      break;
    }
  }

  detectVideoId() {
    let videoId = null;
    const integration = getIntegrationForSite(this.props.site);
    if (integration) {
      videoId = integration.detectVideoId();
      if (videoId !== this.state.videoId) {
        this.setState({
          videoId
        });
      }
    }
  }

  componentDidMount() {
    if (global.chrome && global.chrome.runtime && global.chrome.runtime.onMessage) {
      global.chrome.runtime.onMessage.addListener(this.onMessage);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.site !== prevProps.site) {
      this.detectVideoId();
    }
  }

  componentWillUnmount() {
    if (global.chrome && global.chrome.runtime && global.chrome.runtime.onMessage) {
      global.chrome.runtime.onMessage.removeListener(this.onMessage); // TODO - Untested
    }
  }

  render() {
    return this.props.children(this.state.videoId);
  }
}

export default VideoId;
