import React from 'react';
import ReactDOM from 'react-dom';
import CaptionsWithPopper from './CaptionsWithPopper';

class Captions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      adapter,
      settings,
      currentCaptionToRender
    } = this.props;

    const {
      canRenderInCaptionWindow,
      captionWindow
    } = adapter;

    if (!settings.isOn || !currentCaptionToRender) {
      return null;
    }

    const captionProps = {};
    if (adapter.captionStyle) {
      captionProps.style = {...adapter.captionStyle};
    }
    if (settings.extraSpace) {
      captionProps.className = 'extra-space';
    }

    // Replace \n's with <br/> elements
    const captionToRender = currentCaptionToRender.split('\n').map(sentence => (
      <React.Fragment>
        <span>{sentence}</span>
        <br/>
      </React.Fragment>
    ));

    if (captionWindow && canRenderInCaptionWindow) {
      return ReactDOM.createPortal((
        <div {...captionProps}>
          {captionToRender}
        </div>
      ), captionWindow);
    } else if (captionWindow && !canRenderInCaptionWindow) {
      // TODO - <CaptionsWithPopper {...this.props}/> ?
      return (
        <CaptionsWithPopper
          adapter={adapter}
          settings={settings}
          currentCaptionToRender={currentCaptionToRender}
        />
      );
    } else {
      return null;
    }
  }
}

export default Captions;
