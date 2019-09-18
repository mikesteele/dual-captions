import React, { Fragment } from 'react';
import { StickyPopper } from './Popper';
import HotKey from './HotKey';

const Fade = props => (
  <div
    style={{
      filter: props.in ? 'opacity(1)' : 'opacity(0)',
      transition: 'filter 200ms',
      pointerEvents: props.in ? 'auto' : 'none'
    }}
  >
    { props.children }
  </div>
);

class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHoveredOver: false
    }
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.animate = this.animate.bind(this);
    this.buttonRef = React.createRef();
  }

  animate() {
    if (this.animationTimeout) {
      window.clearTimeout(this.animationTimeout);
    }
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

  render() {
    const { onClick, tooltipText, children, settings, adapter, hotKeyCode, isOn, videoId } = this.props;
    const { isHoveredOver, isAnimating } = this.state;

    const shouldShow = videoId &&
                       isOn &&
                       (settings.mouseIsActive || isHoveredOver || isAnimating);

    return (
      <Fragment>
        {hotKeyCode && (
          <HotKey
            callback={() => {
              onClick();
              this.animate();
            }}
            hotKeyCode={hotKeyCode}
          />
        )}
        <Fade in={shouldShow}>
          <div
            style={{
              padding: '8px',
              fontSize: '24px',
              background: 'black',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              transition: 'box-shadow 200ms',
              boxShadow: isHoveredOver ? '0px 0px 20px 0px rgba(0,0,0,0.75)' : 'none',
              cursor: 'pointer',
              margin: '8px 0'
            }}
            ref={this.buttonRef}
            onClick={onClick}
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
          >
            { children }
          </div>
          {isHoveredOver && (
            <StickyPopper
              target={this.buttonRef.current}
              placement='right'
              dontUpdate
            >
              <div
                style={{
                  background: 'black',
                  color: 'white',
                  padding: '16px',
                  fontSize: '16px',
                  whiteSpace: 'nowrap',
                  marginLeft: '16px',
                  borderRadius: '2px'
                }}
              >
                { tooltipText }
              </div>
            </StickyPopper>
          )}
        </Fade>
      </Fragment>
    );
  }
}

export { Fade };
export default ActionButton;
