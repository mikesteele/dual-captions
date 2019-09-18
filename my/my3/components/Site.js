import { h, Component } from 'preact';

class Site extends Component {
  constructor(props) {
    super(props);
    this.state = {
      site: null
    };
  }

  componentDidMount() {
    const currentURL = window.location.href;
    if (currentURL.includes('netflix')) {
      this.setState({
        site: 'netflix'
      });
    } else if (currentURL.includes('youtube')) {
      this.setState({
        site: 'youtube'
      });
    }
  }

  render() {
    return this.props.children[0](this.state.site);
  }
}

export default Site;
