import React from 'react';
import { StickyPopper } from './Popper';
import Tooltip from './Tooltip';

/*

adapter.loadingTutorialSteps = [
  {
    placement: one of 'top', 'left', 'bottom', 'right'
    label: String,
    node: Node,
    isVisible: Bool
  }
]

*/

const LoadingTutorial = props => {
  const {
    adapter
  } = props;
  if (adapter.loadingTutorialSteps) {
    const steps = adapter.loadingTutorialSteps;
    let result = -1;
    for (let x = steps.length - 1; x >= 0; x--) {
      const s = steps[x];
      if (s.isVisible && s.node) {
        result = x;
        break;
      }
    }
    if (result >= 0) {
      const step = steps[result];
      return (
        <StickyPopper
          target={step.node}
          placement={step.placement}>
          <Tooltip
            placement={step.placement}
          >
            {step.label}
          </Tooltip>
        </StickyPopper>
      );
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export default LoadingTutorial;
