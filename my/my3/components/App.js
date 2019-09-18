import { h } from 'preact';
import IsOn from './IsOn';
import Site from './Site';
import VideoId from './VideoId';
import Adapter from './Adapter';
import { StickyPopper } from './Popper';

const App = () => (
  <IsOn>
    {(isOn) => (
    <Site>
      {(site) => (
        <VideoId site={site}>
          {(videoId) => (
            <Adapter site={site}>
              {(adapter) => (
                <StickyPopper
                  target={adapter.playerControls}
                  placement='top-start'
                >
                  <h1 style={{zIndex: 990000}}>Hi!</h1>
                </StickyPopper>
              )}
            </Adapter>
          )}
        </VideoId>
      )}
    </Site>
    )}
  </IsOn>
);

export default App;
