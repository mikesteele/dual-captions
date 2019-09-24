import React from 'react';

class SpeedControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSpeed: 1
    }
  }
  componentDidMount() {
    const { adapter } = this.props;
    if (adapter.video) {
      this.setState({
        currentSpeed: adapter.video.playbackRate
      });
    }
  }

  render() {
    return (
      <Fade in={}>
        <Material>
          <ActionTooltip>
            <div onClick={() => {
              adapter.video.playbackRate = 0.8;
              this.setState({
                currentSpeed: 0.8
              });
            }}>
            0.8
            </div>
          </ActionTooltip>
        </Material>
      </Fade>
    )
  }
}
