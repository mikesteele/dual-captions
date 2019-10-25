import React from "react";
import ReactDOM from "react-dom";
import { MdClose } from "react-icons/md";

const Modal = props => {
  const { isOpen, onClose, children, title, withPortal } = props;

  const onClickOuter = () => {
    onClose();
  };

  const onClickInner = e => {
    e.stopPropagation();
  }

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
    width: '50%',
    height: '50%',
    background: '#0d0d0d',
    color: '#E1E1E1',
    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.5)',
    padding: '32px',
    fontSize: '16px',
    lineHeight: '20px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '400px'
  };

  const headingStyle = {
    fontSize: '24px',
    lineHeight: '28px',
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between'
  };

  const modal = (
    <div style={outerStyles} onClick={onClickOuter}>
      <div style={innerStyles} onClick={onClickInner}>
        <div style={headingStyle}>
          <span>{title}</span>
          <span onClick={onClose} style={{cursor: 'pointer'}}><MdClose /></span>
        </div>
        {children}
      </div>
    </div>
  );

  if (withPortal) {
    return ReactDOM.createPortal(modal, withPortal);
  } else {
    return modal;
  }
};

export default Modal;
