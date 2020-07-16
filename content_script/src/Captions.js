import React from 'react';
import ReactDOM from 'react-dom';
import WithPopper from './Popper';

const Popper = WithPopper;

class Captions extends React.Component {
  constructor(props) {
    super(props);
    this.onPopperPositionChanged = this.onPopperPositionChanged.bind(this);
    this.previousPosition = null;
    this.previousCaptionStyle = null;
    this.previousCaptionWindowStyle = null;
  }

  onPopperPositionChanged(position) {
    this.previousPosition = position;
  }

  render() {
    const {
      adapter,
      settings,
      currentCaptionToRender,
      isOn
    } = this.props;

    const {
      canRenderInCaptionWindow,
      captionWindow
    } = adapter;

    if (!isOn) {
      return null;
    }

    if (adapter.captionStyle) {
      this.previousCaptionStyle = adapter.captionStyle;
    }
    if (adapter.captionWindowStyle) {
      this.previousCaptionWindowStyle = adapter.captionWindowStyle;
    }

    const captionWindowProps = {};
    if (adapter.captionWindowStyle) {
      captionWindowProps.style = {
        ...adapter.captionWindowStyle
      };
    } else if (this.previousCaptionWindowStyle) {
      captionWindowProps.style = {...this.previousCaptionWindowStyle};
    }

    const captionProps = {};
    if (adapter.captionStyle) {
      captionProps.style = {...adapter.captionStyle};
    } else if (this.previousCaptionStyle) {
      captionProps.style = {...this.previousCaptionStyle};
    } else if (adapter.defaultCaptionStyle) {
      captionProps.style = {...adapter.defaultCaptionStyle};
    }
    if (settings.extraSpace) {
      captionProps.className = 'extra-space';
    }
    if (settings.customColorsEnabled) {
      if (settings.customTextColor) {
        captionProps.style = {
          ...captionProps.style,
          color: settings.customTextColor
        }
      }
    }
    if (settings.smallText && adapter.smallTextSize) {
      captionProps.style = {
        ...captionProps.style,
        fontSize: adapter.smallTextSize
      }
    }

    // Replace \n's with <br/> elements
    const captionToRender = currentCaptionToRender.split('\n').map(sentence => (
      <React.Fragment>
        <span>{sentence}</span>
        <br/>
      </React.Fragment>
    ));

    const shouldRenderCaptionWindow = currentCaptionToRender !== '';

    if (captionWindow && canRenderInCaptionWindow) {
      /**
       *
       *  If we can render in the caption window, we'll create a Portal.
       *  We also render a hidden Popper to capture the last position, so if the caption window disappears,
       *  we can render captions in the last position it was.
       *
       */
      const portal = ReactDOM.createPortal((
        <React.Fragment>
          <div {...captionProps}>
            { captionToRender }
          </div>
        </React.Fragment>
      ), captionWindow);
      const previousPosition = (
        <Popper
          noPointerEvents
          target={captionWindow}
          onPositionChanged={this.onPopperPositionChanged}>
          <div {...captionWindowProps} style={{visibility: 'hidden'}}>
            <div {...captionProps}>
              { captionToRender }
            </div>
          </div>
        </Popper>
      );
      return (
        <React.Fragment>
          { portal }
          { previousPosition } {/* Position tracker */}
       </React.Fragment>
      );
    } else if (captionWindow && !canRenderInCaptionWindow) {
      return (
        <Popper
          noPointerEvents
          target={captionWindow}
          onPositionChanged={this.onPopperPositionChanged}>
          {
            shouldRenderCaptionWindow ? (
              <div {...captionWindowProps}>
                <div {...captionProps}>
                  { captionToRender }
                </div>
              </div>
            ) : (
              <div/>
            )
          }
        </Popper>
      );
    } else if (adapter.captionWindowFixedPosition) {
      /**
       *  The Disney+ adapter uses a fixed position for its caption window.
       *  This is because the host captions are rendered via <video> textTracks
       *  and they don't move.
       */
      return shouldRenderCaptionWindow ? (
        <div className='dc-popper' style={adapter.captionWindowFixedPosition}>
          <div {...captionWindowProps}>
            <div {...captionProps}>
              { captionToRender }
            </div>
          </div>
        </div>
      ) : (
        <div/>
      );
    } else if (this.previousPosition) {
      /**
       *  If the caption window isn't in the DOM, but we have a caption to render,
       *  we use the last known position of the second captions.
       */
      return shouldRenderCaptionWindow ? (
        <div className='dc-z-index dc-no-pointer-events' style={this.previousPosition}>
          <div {...captionWindowProps}>
            <div {...captionProps}>
              { captionToRender }
            </div>
          </div>
        </div>
      ) : (
        <div/>
      );
    } else {
      return null;
    }
  }
}

// Helper for creating a Portal to adapter.fullscreenRoot if fullscreen enabled
const FullscreenHOC = props => {
  const {
    adapter,
    children
  } = props;
  if (adapter.fullscreenRoot) {
    return ReactDOM.createPortal(children, adapter.fullscreenRoot);
  } else {
    return children;
  }
};

export { FullscreenHOC };
export default Captions;
