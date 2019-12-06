import React from 'react';
import { getIntegrationForSite } from './utils/integrations';

class NewAdapter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        time: Date.now()
      });
    }, 100);
    console.log('Starting timer...');
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    console.log('Stopping timer...');
  }

  render() {
    const {
      site
    } = this.props;
    let adapter = {};
    const integration = getIntegrationForSite(site);
    if (integration && integration.adapter) {
      adapter = integration.adapter();
    }
    return this.props.children(adapter);
  }
};

export default NewAdapter;
