import React from 'react';
import ActionButton from './ActionButton';
import { StickyPopper } from './Popper';
import { MdAssignment } from 'react-icons/md';

const S_KEY_CODE = 83;
const ALT_KEY_CODE = 18;

class ClipboardAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false,
    }
    this.copyCaptionsToClipboard = this.copyCaptionsToClipboard.bind(this);
    this.playAnimation = this.playAnimation.bind(this);
    this.animationTimeout = null;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.altKeyPressed = false;
    this.sKeyPressed = false;
  }

  onKeyDown(e) {
    if (e.keyCode === S_KEY_CODE) {
      this.sKeyPressed = true;
    }
    if (e.keyCode === ALT_KEY_CODE) {
      this.altKeyPressed = true;
    }
    if (this.sKeyPressed && this.altKeyPressed) {
      this.copyCaptionsToClipboard();
    }
  }

  onKeyUp(e) {
    if (e.keyCode === S_KEY_CODE) {
      this.sKeyPressed = false;
    }
    if (e.keyCode === ALT_KEY_CODE) {
      this.altKeyPressed = false;
    }
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

  componentDidMount() {
    document.body.addEventListener('keydown', this.onKeyDown);
    document.body.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    if (this.animationTimeout) {
      window.clearTimeout(this.animationTimeout);
    }
    document.body.removeEventListener('keydown', this.onKeyDown);
    document.body.removeEventListener('keyup', this.onKeyUp);
  }

  render() {
    return (
      <ActionButton
        onClick={this.copyCaptionsToClipboard}
        tooltipText={this.state.isAnimating ? 'Copied' : 'Copy captions to clipboard'}
        settings={this.props.settings}
        adapter={this.props.adapter}
        alsoShowIf={this.state.isAnimating}
      >
        <MdAssignment />
      </ActionButton>
    )
  }
}

export default ClipboardAction;
