import React, { Fragment } from 'react';
import { StickyPopper } from './Popper';
import { MdFastRewind } from 'react-icons/md';

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
