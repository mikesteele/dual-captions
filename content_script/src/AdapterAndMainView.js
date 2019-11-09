import React from 'react';
import MainView from './MainView';
import { NetflixAdapterCreator } from './adapters/netflix';
import { YoutubeAdapterCreator } from './adapters/youtube';
import { DevelopmentAdapterCreator } from './adapters/development';
const isEqual = require('lodash.isequal');

class AdapterAndMainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { site } = this.props;
    this.interval = window.setInterval(() => {
      let adapter = {};
      if (site === 'youtube') {
        adapter = YoutubeAdapterCreator();
      }
      if (site === 'netflix') {
        adapter = NetflixAdapterCreator();
      }
      if (site === 'development') {
        adapter = DevelopmentAdapterCreator();
      }
      for (const key in adapter) {
        if (!isEqual(this.state[key], adapter[key])) {
          this.setState(prevState => {
            const newState = {...prevState};
            newState[key] = adapter[key];
            return newState;
          });
        }
      }
    }, 200);
  }
  render() {
    const {
      settings,
      provider,
      isOn,
      videoId,
      site
    } = this.props;
    const {
      playerCurrentTime,
      ...adapter
    } = this.state;
    return (
      <MainView
        playerCurrentTime={playerCurrentTime}
        adapter={adapter}
        provider={provider}
        settings={settings}
        isOn={true}
        videoId={videoId}
        site={site}
      />
    )
  }
};

export default AdapterAndMainView;
