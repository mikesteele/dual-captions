import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import Site from './Site';
import Adapter from './Adapter';
import Parser from './Parser';
import PopupMessageHandler from './PopupMessageHandler';
import Provider from './Provider';
import Captions, { FullscreenHOC } from './Captions';
import { NetflixAdapterCreator } from './adapters/netflix';
import { YoutubeAdapterCreator } from './adapters/youtube';
import InjectedStyles from './Styles';
import withTimer from './with-timer';
import ClipboardAction from './ClipboardAction';
import { StickyPopper } from './Popper';
import ViewBookmarksAction from './ViewBookmarksAction';
import Modal from './Modal';
import MainView from './MainView';
import VideoId from './VideoId';
import IsOn from './IsOn';

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <InjectedStyles/>
        <IsOn>
          {(isOn) => (
          <Site>
            {(site) => (
              <VideoId site={site}>
                {(videoId) => (
                  <Parser site={site}>
                    {(parser) => (
                      <Provider
                        site={site}
                        videoId={videoId}
                        parser={parser}>
                        {(provider) => (
                          <PopupMessageHandler
                            site={site}
                            provider={provider}
                            isOn={isOn}
                          >
                            {(settings) => {
                              if (isOn) {
                                let ConnectedAdapter;
                                if (site ===  'netflix') {
                                  ConnectedAdapter = withTimer(Adapter, NetflixAdapterCreator);
                                  // TODO - Should have an HOC to pass site
                                } else if (site === 'youtube') {
                                  ConnectedAdapter = withTimer(Adapter, YoutubeAdapterCreator);
                                } else if (site === null) {
                                  return (
                                    <div/>
                                  );
                                } else {
                                  throw new Error(`No adapter found for site: ${site}`); // TODO - Doesn't get caught by ErrorBoundary
                                }
                                return (
                                  <ConnectedAdapter site={site}>
                                    {(adapter) => (
                                      <FullscreenHOC adapter={adapter}>
                                        <MainView
                                          adapter={adapter}
                                          settings={settings}
                                          provider={provider}
                                          isOn={true}
                                          videoId={videoId}
                                        />
                                      </FullscreenHOC>
                                    )}
                                  </ConnectedAdapter>
                                );
                              } else {
                                return null;
                              }
                            }}
                          </PopupMessageHandler>
                        )}
                      </Provider>
                    )}
                  </Parser>
                )}
              </VideoId>
            )}
          </Site>
          )}
        </IsOn>
      </ErrorBoundary>
    );
  }
}

export default App;
