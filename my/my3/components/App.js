import { h } from 'preact';
import IsOn from './IsOn';
import Site from './Site';
import VideoId from './VideoId';
import Adapter from './Adapter';
import Fade from './Fade';
import Styles from './Styles';
import { StickyPopper } from './Popper';
import FullscreenPortal from './FullscreenPortal';

const App = () => (
  <div>
    <Styles />
    <IsOn>
      {(isOn) => (
      <Site>
        {(site) => (
          <VideoId site={site}>
            {(videoId) => (
              <Adapter site={site}>
                {(adapter) => (
                  <FullscreenPortal adapter={adapter}>
                    <StickyPopper
                      target={adapter.playerControls}
                      placement='top-start'
                    >
                      <Fade in={isOn}>
                        <h1 style={{zIndex: 990000}}>Hi!</h1>
                      </Fade>
                    </StickyPopper>
                  </FullscreenPortal>
                )}
              </Adapter>
            )}
          </VideoId>
        )}
      </Site>
      )}
    </IsOn>
  </div>
);

export default App;
