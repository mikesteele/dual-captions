import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import Site from './Site';
import Adapter from './Adapter';
import Parser from './Parser';
import PopupMessageHandler from './PopupMessageHandler';
import Provider from './Provider';
import Captions, { FullscreenHOC } from './Captions';
import TranslationQueue from './TranslationQueue';
import { NetflixAdapterCreator } from './adapters/netflix';
import { YoutubeAdapterCreator } from './adapters/youtube';
import InjectedStyles from './Styles';
import withTimer from './with-timer';
import ClipboardAction from './ClipboardAction';
import { StickyPopper } from './Popper';
import ViewFlagsAction from './ViewFlagsAction';
import Modal from './Modal';
import MainView from './MainView';

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <InjectedStyles/>
        <Site>
          {(site) => {
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
                  <TranslationQueue>
                  {(queue) => (
                    <Parser>
                      {(parser) => (
                        <PopupMessageHandler adapter={adapter}>
                          {(settings) => (
                            <Provider
                              adapter={adapter}
                              parser={parser}
                              settings={settings}
                              queue={queue}>
                              {(currentCaptionToRender) => (
                                <FullscreenHOC adapter={adapter}>
                                  <MainView
                                    adapter={adapter}
                                    settings={settings}
                                    currentCaptionToRender={currentCaptionToRender}
                                  />
                                </FullscreenHOC>
                              )}
                            </Provider>
                          )}
                        </PopupMessageHandler>
                      )}
                    </Parser>
                  )}
                  </TranslationQueue>
                )}
              </ConnectedAdapter>
            );
          }}
        </Site>
      </ErrorBoundary>
    );
  }
}

export default App;
