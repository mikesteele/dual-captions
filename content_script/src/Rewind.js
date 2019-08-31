import React, { Fragment } from 'react';
import { StickyPopper } from './Popper';
import { MdFastRewind } from 'react-icons/md';

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

  render() {
    const { onClick, tooltipText, children, settings } = this.props;
    const { isHoveredOver } = this.state;

    const shouldShow = settings.isOn && (settings.mouseIsActive || isHoveredOver);

    return (
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
            cursor: 'pointer'
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
          >
            <div
              style={{
                background: 'black',
                color: 'white',
                padding: '16px',
                fontSize: '16px',
                whiteSpace: 'nowrap',
                marginLeft: '16px'
              }}
            >
              { tooltipText }
            </div>
          </StickyPopper>
        )}
      </Fade>
    );
  }
}

const Rewind = props => (
  <ActionButton
    onClick={() => { alert('rewind!') }}
    tooltipText='Rewind to last caption'
    settings={props.settings}
  >
    <MdFastRewind />
  </ActionButton>
);

export { Fade };
export default Rewind;
