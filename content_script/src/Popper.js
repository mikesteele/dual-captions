import React from 'react';
import Popper from 'popper.js';

const isZero = (val) => val === '0' || val === '0px';

const shouldRejectTransform = transform => {
  let result = false;
  let work = transform.split('(');
  if (work.length === 2) {
    work = work[1].split(')');
    if (work.length === 2) {
      work = work[0].split(', ');
      if (work.length === 3) {
        if (isZero(work[0]) || isZero(work[1])) {
          console.log(`debug - rejecting update ${transform}`);
          result = true;
        }
      }
    }
  }
  return result;
}

class StickyPopper extends React.Component {
  constructor(props) {
    super(props);
    this.previousPosition = null;
    this.onPositionChanged = this.onPositionChanged.bind(this);
  }

  onPositionChanged(position) {
    if(!shouldRejectTransform(position.transform)) {
      this.previousPosition = position;
    } else {
      console.log(`debug - rejecting saving ${position.transform}`);
    }
  }

  render() {
    const {
      children,
      target
    } = this.props;
    if (target) {
      return (
        <WithPopper
          {...this.props}
          onPositionChanged={this.onPositionChanged}
        >
          { children }
        </WithPopper>
      );
    } else if (this.previousPosition) {
      return (
        <div className='dc-popper' style={this.previousPosition}>
          { children }
        </div>
      )
    } else {
      return null;
    }
  }
}

class WithPopper extends React.Component {
  constructor(props) {
    super(props);
    this.canAttachToTarget = this.canAttachToTarget.bind(this);
    this.createPopper = this.createPopper.bind(this);
    this.popper = null;
  }

  createPopper() {
    const {
      placement
    } = this.props;
    console.log('Creating new Popper.');
    if (this.popper) {
      this.popper.destroy();
      document.getElementById('dc-debug').innerHTML = 'destroy';
    }
    this.popper = new Popper(
      this.props.target,
      this.popperPosition,
      {
        onCreate: (data) => {
          if (this.props.onPositionChanged) {
            this.props.onPositionChanged(data.styles);
          }
        },
        onUpdate: (data) => {
          if (this.props.onPositionChanged) {
            this.props.onPositionChanged(data.styles);
          }
        },
        placement: placement,
        modifiers: {
          flip: {
            enabled: false
          },
          applyStyle: {
            fn: (data, options) => {
              if (shouldRejectTransform(data.styles.transform)) {
                return data;
              }

              data.instance.popper.style = {
                ...data.styles
              };

              return data;
            }
          }
        }
      }
    );
    document.getElementById('dc-debug').innerHTML = 'create';
  }

  canAttachToTarget() {
    return this.props.target && this.popperPosition;
  }

  componentDidMount() {
    if (this.canAttachToTarget()) {
      this.createPopper();
    }
  }

  componentWillUnmount() {
    if (this.popper) {
      this.popper.destroy();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.target !== this.props.target && this.canAttachToTarget()) {
      this.createPopper();
    } else {
      if (this.popper && this.props.target) {
        this.popper.scheduleUpdate();
        document.getElementById('dc-debug').innerHTML = this.props.target.style.bottom;
      }
    }
  }

  render() {
    return (
      <div className='dc-popper' ref={(ref) => this.popperPosition = ref}>
        {this.props.children}
      </div>
    );
  }
}

WithPopper.defaultProps = {
  placement: 'bottom'
}

export { StickyPopper };
export default WithPopper;
