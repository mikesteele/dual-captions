import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';

const ErrorModal = props => {
  const { adapter, isOpen, onClose, children, title, withPortal } = props;

  const onClickOuter = () => {
    onClose();
  };

  const onClickInner = e => {
    e.stopPropagation();
  };

  const outerStyles = {
    position: "fixed",
    width: "100%",
    height: "100%",
    filter: isOpen ? "opacity(1)" : "opacity(0)",
    background: "rgba(0, 0, 0, 0.5)",
    pointerEvents: isOpen ? "auto" : "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "filter 200ms",
    zIndex: '10000',
    top: '0',
    left: '0'
  };

  const innerStyles = {
    background: '#0d0d0d',
    color: '#E1E1E1',
    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.5)',
    padding: '32px',
    fontSize: '16px',
    lineHeight: '20px',
    borderRadius: '8px',
    display: 'inline-flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const headingStyle = {
    fontSize: '24px',
    lineHeight: '28px',
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between'
  };

  const buttonStyles = {
    textAlign: 'center',
    width: '64px',
    margin: '32px 8px 8px 8px'
  };

  const modal = (
    <div style={outerStyles} onClick={onClickOuter}>
      <div style={innerStyles} onClick={onClickInner}>
        {children}
        <Button additionalStyles={buttonStyles} onClick={onClose}>
          OK
        </Button>
      </div>
    </div>
  );

  const portalRoot = adapter.fullscreenRoot || document.body;
  return ReactDOM.createPortal(modal, portalRoot);
}

export default ErrorModal;
