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

const Actions = props => {
  const { adapter, settings, currentCaptionToRender } = props;
  const shouldShow = settings.mouseIsActive && settings.isOn;
  return (
    <StickyPopper
      target={adapter.playerControls}
      placement='top-start'
      updateInfrequently
    >
      <div style={{
        padding: '8px'
      }}>
        <ClipboardAction
          adapter={adapter}
          settings={settings}
          currentCaptionToRender={currentCaptionToRender}
        />
      </div>
    </StickyPopper>
  );
}

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
                                  <Captions
                                    adapter={adapter}
                                    currentCaptionToRender={currentCaptionToRender}
                                    settings={settings}
                                  />
                                  <Actions
                                    adapter={adapter}
                                    currentCaptionToRender={currentCaptionToRender}
                                    settings={settings}
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
