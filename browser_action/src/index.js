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
      isLoaded: false,
    }
  };

  componentDidMount() {
    window.setInterval(this.checkLoadedLanguages.bind(this), 2 * 1000);
    this.props.dispatch(determineState())
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
    const { isLoaded } = this.state;
    if (isLoaded && isRedesign) {
      return (
        <RedesignApp />
      );
    } else if (isLoaded && !isRedesign) {
      return (
        <LegacyApp />
      );
    } else {
      return null;
    }
  }
};

const ConnectedApp = connect(state => ({...state}))(App);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp/>
  </Provider>,
  document.getElementById('root')
);
