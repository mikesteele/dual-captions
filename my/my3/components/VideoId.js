import { h, Component } from 'preact';

class VideoId extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: null
    };
    this.detectVideoId = this.detectVideoId.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  detectNetflixVideoId() {
    const videoIdPattern = /watch\/(\d+)/;
    const pathname = window.location.pathname;
    if (videoIdPattern.test(pathname)) {
      return videoIdPattern.exec(pathname)[1];
    } else {
      return null;
    }
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

  detectYoutubeVideoId() {
    const url = new URL(window.location.href);
    const videoId = url.searchParams.get('v');
    return videoId ? videoId : null;
  }

  detectVideoId() {
    let videoId = null;
    if (this.props.site === 'netflix') {
      videoId = this.detectNetflixVideoId();
    } else if (this.props.site === 'youtube') {
      videoId = this.detectYoutubeVideoId(); // TODO - Audit repo for Youtube vs YouTube
    }
    if (videoId !== this.state.videoId) {
      // TODO - There are probably other places where I'm setting state unnecessarily
      this.setState({
        videoId
      });
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
    return this.props.children[0](this.state.videoId);
  }
}

export default VideoId;
