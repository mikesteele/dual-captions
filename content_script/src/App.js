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
import Adapter from './Adapter';

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <InjectedStyles/>
          <Site>
            {(site) => (
            <IsOn site={site}>
              {(isOn, changeIsOn) => (
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
                            changeIsOn={changeIsOn}
                          >
                            {(settings) => {
                              if (isOn) {
                                return (
                                  <Adapter site={site}>
                                    {(adapter) => (
                                      <FullscreenHOC adapter={adapter}>
                                        <MainView
                                          adapter={adapter}
                                          settings={settings}
                                          provider={provider}
                                          isOn={true}
                                          site={site}
                                        />
                                      </FullscreenHOC>
                                    )}
                                  </Adapter>
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
