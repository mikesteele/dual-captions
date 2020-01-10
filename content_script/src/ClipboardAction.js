import React from 'react';
import ActionButton from './ActionButton';
import { StickyPopper } from './Popper';
import { MdAssignment } from 'react-icons/md';
import translate from './utils/translate';

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
    const {
      adapter,
      settings,
      isOn,
    } = this.props;
    const { isAnimating } = this.state;
    const t = key => translate(settings.uiLanguage, key);
    return (
      <ActionButton
        onClick={this.copyCaptionsToClipboard}
        tooltipText={this.state.isAnimating ? t('copied') : t('copy-captions-to-clipboard')}
        settings={this.props.settings}
        adapter={this.props.adapter}
        isOn={this.props.isOn}
      >
        <MdAssignment />
      </ActionButton>
    )
  }
}

export default ClipboardAction;
