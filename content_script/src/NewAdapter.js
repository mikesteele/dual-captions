import React from 'react';
import { NetflixAdapterCreator } from './adapters/netflix';
import { YoutubeAdapterCreator } from './adapters/youtube';

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
    if (site === 'youtube') {
      adapter = YoutubeAdapterCreator();
    }
    if (site === 'netflix') {
      adapter = NetflixAdapterCreator();
    }
    return this.props.children(adapter);
  }
};

export default NewAdapter;
