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

const Wrapper = () => {
  const body = (
    <div className={s.Wrapper}>
      <Toggle icons={false} />
    </div>
  )
  return ReactDOM.createPortal(
    body,
    document.body
  );
}

const App = props => (
  <SavedStore>
    {savedStore => {
      if (savedStore) {
        return (
          <Wrapper savedStore={savedStore} />
        );
      } else {
        return null;
      }
    }}
  </SavedStore>
);

export default App;
