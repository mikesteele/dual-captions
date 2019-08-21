import React from 'react';

export default function withTimer(WrappedComponent, AdapterCreator) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        time: 0
      }
    }

    componentDidMount() {
      this.timer = setInterval(() => {
        this.setState({
          time: Date.now()
        });
      }, 100);
    }

    componentWillUnmount() {
      clearInterval(this.timer);
    }

    render() {
      const awareness = AdapterCreator();
      return (
        <WrappedComponent
         {...this.props}
         awareness={awareness}
         time={this.state.time}
        />
      );
    }
  };
}
