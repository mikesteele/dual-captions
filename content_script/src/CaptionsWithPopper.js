import React from 'react';
import Popper from 'popper.js';

class CaptionsWithPopper extends React.Component {
  constructor(props) {
    super(props);
    this.attachToCaptionWindow = this.attachToCaptionWindow.bind(this);
    this.canAttachToCaptionWindow = this.canAttachToCaptionWindow.bind(this);
  }

  canAttachToCaptionWindow() {
    return this.dcPosition && this.props.adapter.captionWindow;
  }

  attachToCaptionWindow() {
    console.log('Attaching...');
    this.popper = new Popper(
      this.props.adapter.captionWindow,
      this.dcPosition
    );
  }

  componentDidMount() {
    if (this.canAttachToCaptionWindow()) {
      this.attachToCaptionWindow();
    }
  }

  componentWillUnmount() {
    // TODO - Delete this.popper - ?
  }

  componentDidUpdate(prevProps) {
    if (prevProps.adapter.captionWindowPosition !== this.props.adapter.captionWindowPosition) {
      if (this.canAttachToCaptionWindow()) {
        this.attachToCaptionWindow();
      }
    }
  }

  render() {
    const {
      adapter,
      settings,
      currentCaptionToRender
    } = this.props;

    if (!settings.isOn || !currentCaptionToRender) {
      return null;
    }

    // Caption Window props
    const captionWindowProps = {
      className: 'dc-window'
    };
    if (adapter.captionWindowStyle) {
      captionWindowProps.style = {
        ...adapter.captionWindowStyle
      };
    }

    // Caption props
    const captionProps = {
      className: 'dc-caption'
    };
    if (adapter.captionClassName) {
      captionProps.className = `${captionProps.className} ${adapter.captionClassName}`;
    }
    if (adapter.captionStyle) {
      captionProps.style = {
        ...adapter.captionStyle
      };
    }

    // Replace \n's with <br/> elements - TODO - Improve this
    const captionToRender = currentCaptionToRender.split('\n').map(sentence => (
      <React.Fragment>
        <span>{sentence}</span>
        <br/>
      </React.Fragment>
    ));

    return (
      <div {...captionWindowProps}>
        <div ref={ref => { this.dcPosition = ref }}>
          <div {...captionProps}>
            { captionToRender }
          </div>
        </div>
      </div>
    );
  }
}

export default CaptionsWithPopper;
