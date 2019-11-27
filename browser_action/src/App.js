import React from 'react';
import ReactDOM from 'react-dom';
import ClassicApp from './classic/App';
import NeonApp from './neon/App';
import s from './App.styles.js';

import Toggle from 'react-toggle';

class SavedStore extends React.Component {
  render() {
    return this.props.children(true);
  }
}

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNeon: true // TODO - Revert to false
    };
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(e) {
    this.setState({
      isNeon: e.target.checked
    });
  }

  render() {
    const { isNeon } = this.state;
    const toggle = (
      <div className={s.Wrapper}>
        <Toggle
          checked={isNeon}
          onChange={this.onToggle}
          icons={false}
        />
      </div>
    );
    const portal = ReactDOM.createPortal(
      toggle,
      document.body
    );
    const app = isNeon ? <NeonApp/> : <ClassicApp/>
    return (
      <div>
        {portal}
        {app}
      </div>
    );
  }
}

const App = props => (
  <SavedStore>
    {savedStore => (
      <Wrapper savedStore={savedStore} />
    )}
  </SavedStore>
);

export default App;
