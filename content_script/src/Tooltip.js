import React from 'react';
import { MdClose } from 'react-icons/md';
// import MdEdit from 'react-icons/lib/md/edit';
import { FaPlay } from 'react-icons/fa';

const Tooltip = props => {
  const {
    onClickClose,
    placement
  } = props;
  const arrowStyles = {};
  if (placement === 'right') {
    arrowStyles.left = '-24px';
    arrowStyles.top = '0';
    arrowStyles.transform = 'scaleX(-1)';
    arrowStyles.height = '100%';
  }
  if (placement === 'left') {
    arrowStyles.right = '-24px';
    arrowStyles.top = '0';
    arrowStyles.height = '100%';
  }
  if (placement === 'top') {
    arrowStyles.bottom = '-24px';
    arrowStyles.left = '0';
    arrowStyles.width = '100%';
    arrowStyles.justifyContent = 'center';
    arrowStyles.transform = 'rotateZ(90deg)';
  }
  if (placement === 'bottom') {
    arrowStyles.top = '-24px';
    arrowStyles.left = '0';
    arrowStyles.width = '100%';
    arrowStyles.justifyContent = 'center';
    arrowStyles.transform = 'rotateZ(270deg)';
  }
  return (
    <div
      style={{
        backgroundColor: "#202020",
        color: "#E1E1E1",
        boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.5)",
        display: "inline-flex",
        padding: "16px",
        borderRadius: "8px",
        fontFamily: "sans-serif",
        fontSize: "20px",
        lineHeight: "24px",
        position: "relative",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "200px"
      }}
    >
      {props.children}
      {onClickClose && (
        <div
          style={{
            width: 24,
            marginLeft: 24,
            fontSize: 20,
            lineHeight: 20,
            height: 20,
            display: 'inline-flex',
          }}
        >
          <MdClose
            onClick={props.onClickClose}
            style={{
              cursor: 'pointer'
            }}
           />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          fontSize: "32px",
          lineHeight: "32px",
          display: "flex",
          alignItems: "center",
          color: "#202020",
          ...arrowStyles
        }}
      >
        <FaPlay />
      </div>
    </div>
  );
};

export default Tooltip;
