import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import './index.css';
import LegacyApp from './legacy/App';
import RedesignApp from './redesign/App';
import './i18n';
import reducer from './reducer';
import ReduxThunk from 'redux-thunk';
import { i18nMiddleware, loggingMiddleware, storageMiddleware } from './middleware';
import { determineState, popupOpened, detectSite, checkLoadedLanguages, changeUILanguage } from './actions';
import { css } from 'emotion';
import cn from 'classnames';

const wrapper = css`
  width: 350px;
  height: 525px;
  overflow-y: scroll;
  opacity: 0;
  transition: opacity 200ms;
`;

const loaded = css`
  opacity: 1 !important;
`;


const store = createStore(reducer,
  applyMiddleware(
    ReduxThunk,
    i18nMiddleware,
    loggingMiddleware,
    storageMiddleware
  )
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true, // TODO - Revert
    }
  };

  componentDidMount() {
    window.setInterval(this.checkLoadedLanguages.bind(this), 2 * 1000);
    this.props.dispatch(determineState())
      .then(isSavedStore => {
        this.setState({
          isFirstLaunch: !isSavedStore
        });
        return Promise.resolve();
      })
      .then(this.props.dispatch(popupOpened()))
      .then(this.props.dispatch(detectSite()))
      .then(() => {
        setTimeout(() => this.setState({ isLoaded: true }), 200);
      })
      .catch(err => {
        console.log(err);
      });
  };

  checkLoadedLanguages() {
    this.props.dispatch(checkLoadedLanguages());
  };

  render() {
    const { isRedesign } = this.props;
    const { isLoaded, isFirstLaunch } = this.state;
    // TODO - isFirstLaunch={isFirstLaunch}
    let app = isRedesign ? <RedesignApp isFirstLaunch /> : <LegacyApp />;
    // TODO - Remove fade or pass isLoaded?
    return (
      <div className={cn(wrapper, {[loaded]: isLoaded})}>
        {app}
      </div>
    );
  }
};

const ConnectedApp = connect(state => ({...state}))(App);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp/>
  </Provider>,
  document.getElementById('root')
);
