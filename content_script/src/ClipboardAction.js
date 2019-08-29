import React from 'react';
import { StickyPopper } from './Popper';
import { MdAssignment, MdAssignmentTurnedIn } from 'react-icons/md';

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

    this.buttonRef = React.createRef();
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
    const { adapter, secondCaptionText } = this.props;
    const firstCaptionText = adapter.captionText;
    navigator.clipboard.writeText(`${firstCaptionText}\n${secondCaptionText}`)
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

    const firstCaptionText = adapter.captionText;

    // It appears when the mouse is active or is being hovered over
    const isVisible = settings.mouseIsActive || isHoveredOver;

    const shouldShow = isVisible && settings.isOn;

    return (
      <React.Fragment>
        <StickyPopper
          target={adapter.playerControls}
          placement='top-start'
        >
          <div
            onClick={this.copyCaptionsToClipboard}
            style={{
              filter: shouldShow ? 'opacity(1)' : 'opacity(0)',
              transition: 'filter 200ms',
              pointerEvents: shouldShow ? 'auto' : 'none'
            }}
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
          >
            <div
              style={{
                padding: '24px',
                fontSize: '36px',
                background: 'black',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50px',
                height: '50px',
                transition: 'box-shadow 200ms',
                boxShadow: isHoveredOver ? '0px 0px 20px 0px rgba(0,0,0,0.75)' : 'none'
              }}
              ref={this.buttonRef}
            >
              { isAnimating ? <MdAssignmentTurnedIn/> : <MdAssignment/> }
            </div>
          </div>
        </StickyPopper>
        { isHoveredOver && (
          <StickyPopper
            target={this.buttonRef.current}
            placement='bottom'
          >
            <div
              style={{
                background: 'black',
                color: 'white',
                padding: '8px',
                fontSize: '24px'
              }}
            >
              { isAnimating ? 'Copied!' : 'Copy captions to clipboard' }
            </div>
          </StickyPopper>
        )}
      </React.Fragment>
    )
  }
}

export default ClipboardAction;
