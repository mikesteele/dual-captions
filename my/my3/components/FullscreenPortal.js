import { h } from 'preact';
import Portal from 'preact-portal';

const FullscreenPortal = props => {
  const {
    adapter,
    children
  } = props;
  if (adapter.fullscreenRootSelector) {
    return (
      <Portal into={adapter.fullscreenRootSelector}>
        { children }
      </Portal>
    );
  } else {
    return children;
  }
};

export default FullscreenPortal;
