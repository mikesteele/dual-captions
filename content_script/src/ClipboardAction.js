import React from 'react';
import { StickyPopper } from './Popper';

class ClipboardAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false
    }
    this.copyCaptionsToClipboard = this.copyCaptionsToClipboard.bind(this);
    this.playAnimation = this.playAnimation.bind(this);
    this.animationTimeout = null;
  }

  playAnimation() {
    this.setState({
      isAnimating: true
    }, () => {
      this.animationTimeout = window.setTimeout(() => {
        this.setState({
          isAnimating: false
        })
      }, 200);
    });
  }

  copyCaptionsToClipboard() {
    navigator.clipboard.writeText('TODO')
      .then(this.playAnimation)
      .catch(err => {
        console.error(`Couldn't copy to clipboard: ${err}`);
      });
  }

  componentWillUnmount() {
    if (this.animationTimeout) {
      window.clearTimeout(this.animationTimeout);
    }
  }

  render() {
    const { adapter } = this.props;
    const { isAnimating } = this.state;
    return (
      <StickyPopper
        target={adapter.captionWindow}
        placement='left'
      >
        <div onClick={this.copyCaptionsToClipboard}>
          { isAnimating ? 'checkmark' : 'clipboard' }
        </div>
      </StickyPopper>
    )
  }
}

export default ClipboardAction;
