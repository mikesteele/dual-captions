import React from 'react';
const Integrations = require('dual-captions-site-integrations').integrations;

class Site extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      site: null
    };
  }

  componentDidMount() {
    const currentURL = window.location.href;
    const detectedIntegration = Integrations.find(i => i.detectSite(currentURL));
    if (detectedIntegration) {
      this.setState({
        site: detectedIntegration.siteId
      });
    }
  }

  render() {
    return this.props.children(this.state.site);
  }
}

export default Site;
