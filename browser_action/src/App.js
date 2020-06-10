import React from 'react';
import { determineState, popupOpened, detectSite, checkLoadedLanguages } from './actions';
import LegacyApp from './legacy/App';
import RedesignApp from './redesign/App';
import { connect } from 'react-redux';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true // TODO - Revert
    };
  }
  componentDidMount() {
    window.setInterval(this.checkLoadedLanguages.bind(this), 2 * 1000);
    this.props.dispatch(determineState())
      .then(this.props.dispatch(popupOpened()))
      .then(this.props.dispatch(detectSite()))
      .then(() => {
        this.setState({
          isLoaded: true
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  checkLoadedLanguages() {
    this.props.dispatch(checkLoadedLanguages());
  }

  render() {
    const { isRedesign } = this.props;
    const { isLoaded } = this.state;
    return (
      <div className='App'>
        {isLoaded && isRedesign && (
          <RedesignApp/>
        )}
        {isLoaded && !isRedesign && (
          <LegacyApp/>
        )}
      </div>
    )
  }
}

export default connect(state => ({...state}))(App);
