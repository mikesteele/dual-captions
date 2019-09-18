import { h } from 'preact';
import IsOn from './IsOn';
import Site from './Site';
import VideoId from './VideoId';

const App = () => (
  <IsOn>
    {(isOn) => (
    <Site>
      {(site) => (
        <VideoId site={site}>
          {(videoId) => (
            <h2>isOn: {String(isOn)} / Site: {site} / VideoID: {videoId}</h2>
          )}
        </VideoId>
      )}
    </Site>
    )}
  </IsOn>
);

export default App;
