import React from 'react';
import ActionButton from './ActionButton';
import { StickyPopper } from './Popper';
import { MdAssignment } from 'react-icons/md';

class ClipboardAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false,
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
      }, 600);
    });
  }

  copyCaptionsToClipboard() {
    const { adapter, currentCaptionToRender } = this.props;
    const firstCaptionText = adapter.captionText;
    navigator.clipboard.writeText(`${firstCaptionText}\n${currentCaptionToRender}`)
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
    return (
      <ActionButton
        onClick={this.copyCaptionsToClipboard}
        tooltipText={this.state.isAnimating ? 'Copied' : 'Copy captions to clipboard'}
        settings={this.props.settings}
        adapter={this.props.adapter}
      >
        <MdAssignment />
      </ActionButton>
    )
  }
}

export default ClipboardAction;
