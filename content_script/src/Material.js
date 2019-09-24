import React from 'react';

const Material = props => (
  <div
    style={{
      background: "#0d0d0d",
      color: "#E1E1E1",
      boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.5)",
      display: "inline-flex",
      padding: "32px",
      borderRadius: "8px",
      fontFamily: "sans-serif",
      fontSize: "20px",
      lineHeight: "24px",
      flexDirection: "column",
      alignItems: "center"
    }}>
    {props.children}
  </div>
)

export default Material;
