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
    const fixedCaptionsEnabled = settings.fixedCaptions && adapter.secondCaptionsFixedPosition && adapter.firstCaptionsFixedPositionRules;
    if (fixedCaptionsEnabled) {
      return shouldRenderCaptionWindow ? (
        <div className='dc-popper' style={adapter.secondCaptionsFixedPosition}>
          <div {...captionWindowProps}>
            <div {...captionProps}>
              { captionToRender }
            </div>
          </div>
        </div>
      ) : (
        <div/>
      );
    } else if (captionWindow) {
      return (
        <Popper
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
    } else if (this.previousPosition) {
      /**
       *  If the caption window isn't in the DOM, but we have a caption to render,
       *  we use the last known position of the second captions.
       */
      return shouldRenderCaptionWindow ? (
        <div className='dc-popper' style={this.previousPosition}>
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
