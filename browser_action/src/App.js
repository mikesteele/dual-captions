import React from 'react';
import ClassicApp from './classic/App';

class SavedStore extends React.Component {
  render() {
    return this.props.children(true);
  }
}

const App = props => (
  <SavedStore>
    {savedStore => {
      if (savedStore) {
        return (
          <ClassicApp savedStore={savedStore}/>
        );
      } else {
        return null;
      }
    }}
  </SavedStore>
);

export default App;
