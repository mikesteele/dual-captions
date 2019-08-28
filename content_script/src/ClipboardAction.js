import React from 'react';
import { StickyPopper } from './Popper';

class ClipboardAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false,
      isHoveredOver: false
    }
    this.copyCaptionsToClipboard = this.copyCaptionsToClipboard.bind(this);
    this.playAnimation = this.playAnimation.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.animationTimeout = null;
  }

  onMouseOver() {
    this.setState({
      isHoveredOver: true
    });
  }

  onMouseOut() {
    this.setState({
      isHoveredOver: false
    });
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
    const { adapter, settings, secondCaptionText } = this.props;
    const { isAnimating, isHoveredOver } = this.state;

    // It appears when the mouse is active or is being hovered over
    const shouldAppear = settings.mouseIsActive || isHoveredOver;

    const canCopy = !!secondCaptionText; // TODO - && !!firstCaptionText;

    const isVisible = shouldAppear && canCopy && settings.isOn;

    return (
      <StickyPopper
        target={adapter.captionWindow}
        placement='left'
      >
        <div
          onClick={this.copyCaptionsToClipboard}
          style={{
            padding: '24px',
            fontSize: '24px',
            background: 'red',
            filter: isVisible ? 'opacity(1)' : 'opacity(0)',
            transition: 'filter 200ms'
          }}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
        >
          { isAnimating ? 'checkmark' : 'clipboard' }
          <br/>
          { settings.mouseIsActive ? 'mouse active' : 'mouse inactive' }
          <br/>
          { isHoveredOver ? 'hovered' : 'not hovered' }
          <br/>
          <div id="dc-debug"/>
        </div>
      </StickyPopper>
    )
  }
}

export default ClipboardAction;
