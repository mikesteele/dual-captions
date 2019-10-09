import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import Site from './Site';
import Parser from './Parser';
import PopupMessageHandler from './PopupMessageHandler';
import Provider from './Provider';
import Captions, { FullscreenHOC } from './Captions';
import InjectedStyles from './Styles';
import ClipboardAction from './ClipboardAction';
import { StickyPopper } from './Popper';
import ViewBookmarksAction from './ViewBookmarksAction';
import Modal from './Modal';
import MainView from './MainView';
import VideoId from './VideoId';
import IsOn from './IsOn';
import NewAdapter from './NewAdapter';
import CaptionVisualizer from './debug/CaptionVisualizer';

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <InjectedStyles/>
          <Site>
            {(site) => (
            <IsOn site={site}>
              {(isOn) => (
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
                                return (
                                  <NewAdapter site={site}>
                                    {(adapter) => (
                                      <FullscreenHOC adapter={adapter}>
                                        <CaptionVisualizer parser={parser} />
                                        <MainView
                                          adapter={adapter}
                                          settings={settings}
                                          provider={provider}
                                          isOn={true}
                                          videoId={videoId}
                                          site={site}
                                        />
                                      </FullscreenHOC>
                                    )}
                                  </NewAdapter>
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
          </IsOn>
          )}
        </Site>
      </ErrorBoundary>
    );
  }
}

export default App;
