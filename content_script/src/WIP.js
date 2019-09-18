import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import {
  MdClose,
  MdCheckBoxOutlineBlank,
  MdCheckBox,
  MdBookmark,
  MdBookmarkBorder,
  MdBrightness1,
  MdCheck
} from "react-icons/md";
import { FaPlay } from "react-icons/fa";

const Fade = props => (
  <div
    style={{
      filter: props.in ? "opacity(1)" : "opacity(0)",
      transition: "filter 200ms",
      pointerEvents: props.in ? "auto" : "none"
    }}
  >
    {props.children}
  </div>
);

const Step2Tooltip = () => (
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
      display: "inline-flex",
      flexDirection: "column",
      width: "196px"
    }}
  >
    <div
      style={{
        marginBottom: "0px"
      }}
    >
      <div
        style={{
          fontSize: "20px",
          width: "32px",
          height: "32px",
          background: "#454545",
          textAlign: "center",
          borderRadius: "50%",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        1
      </div>
      <div
        style={{
          fontSize: "20px",
          width: "32px",
          height: "32px",
          lineHeight: "20px",
          background: "#913bfa",
          textAlign: "center",
          borderRadius: "50%",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        2
      </div>
    </div>
    <div>
      <div
        style={{
          fontSize: "20px",
          lineHeight: "24px",
          textAlign: "center",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        Italian{" "}
        <span
          style={{
            display: "flex",
            alignItems: "flex-end",
            color: "#bb86fc"
          }}
        >
          <MdCheck />
        </span>
      </div>
      <div
        style={{
          fontSize: "16px",
          padding: "8px 16px",
          background: "#913bfa",
          marginTop: "4px",
          textAlign: "center",
          borderRadius: "4px"
        }}
      >
        Done
      </div>
    </div>
  </div>
);

const SelectTooltip = () => (
  <ActionTooltip>
    <div
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div
        style={{
          marginBottom: "40px"
        }}
      >
        <div
          style={{
            fontSize: "20px",
            padding: "8px 16px",
            background: "#454545",
            textAlign: "center",
            borderRadius: "4px"
          }}
        >
          Italian
        </div>
        <div
          style={{
            fontSize: "20px",
            padding: "8px 16px",
            background: "#913bfa",
            marginTop: "4px",
            textAlign: "center",
            borderRadius: "4px"
          }}
        >
          English
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: "16px",
            lineHeight: "20px",
            textAlign: "center",
            marginBottom: "8px"
          }}
        >
          Load languages by
          <br />
          selecting them on Netflix.
        </div>
        <div
          style={{
            fontSize: "16px",
            padding: "8px 16px",
            background: "#913bfa",
            marginTop: "4px",
            textAlign: "center",
            borderRadius: "4px"
          }}
        >
          Show me how
        </div>
      </div>
    </div>
  </ActionTooltip>
);

const Icon = props => (
  <span
    style={{
      color: props.color || "#bb86fc",
      fontSize: props.size || "24px",
      lineHeight: props.size || "24px",
      cursor: "pointer",
      ...props.style
    }}
    className={props.className}
  >
    {props.children}
  </span>
);

Icon.defaultProps = {
  style: {}
};

const SettingsView = props => {
  return (
    <Fragment>
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
          flexDirection: "column"
        }}
      >
        <div style={{ display: "inline-flex", paddingBottom: "16px" }}>
          <Icon>
            <MdCheckBox />
          </Icon>{" "}
          <span style={{ paddingLeft: "16px" }}>Small text</span>
        </div>
        <div style={{ display: "inline-flex", paddingBottom: "16px" }}>
          <Icon>
            <MdCheckBox />
          </Icon>{" "}
          <span style={{ paddingLeft: "16px" }}>Small text</span>
        </div>
        <div style={{ display: "inline-flex" }}>
          <div
            style={{
              position: "relative",
              width: 24,
              height: 24
            }}
          >
            <Icon
              size="24px"
              // color="Yellow"
              style={{
                position: "absolute",
                zIndex: 0,
                pointerEvents: "none"
              }}
            >
              <MdBrightness1 />
            </Icon>{" "}
            <Icon
              color="yellow"
              size="16px"
              style={{ position: "absolute", zIndex: 0, top: "4px", left: 4 }}
            >
              <MdBrightness1 />
            </Icon>{" "}
          </div>
          <span style={{ paddingLeft: "16px" }}>Color</span>
        </div>
      </div>
      <Tooltip />
      <SelectTooltip />
      <Step2Tooltip />
      <ActionTooltip />
    </Fragment>
  );
};

const Tooltip = () => (
  <ActionTooltip>
    <div
      style={{
        position: "relative"
      }}
    >
      <Icon
        color="white"
        size="32px"
        style={{
          position: "absolute",
          top: "4px",
          left: "4px",
          pointerEvents: "none"
        }}
      >
        <MdBrightness1 />
      </Icon>{" "}
      <Icon size="40px" color="transparent" className="hover">
        <MdBrightness1 />
      </Icon>{" "}
    </div>
    <div
      style={{
        position: "relative"
      }}
    >
      <Icon
        color="grey"
        size="32px"
        style={{
          position: "absolute",
          top: "4px",
          left: "4px",
          pointerEvents: "none"
        }}
      >
        <MdBrightness1 />
      </Icon>{" "}
      <Icon size="40px" color="transparent" className="hover">
        <MdBrightness1 />
      </Icon>{" "}
    </div>{" "}
    <div
      style={{
        position: "relative"
      }}
    >
      <Icon
        color="yellow"
        size="32px"
        style={{
          position: "absolute",
          top: "4px",
          left: "4px",
          pointerEvents: "none"
        }}
      >
        <MdBrightness1 />
      </Icon>{" "}
      <Icon size="40px" color="transparent" className="hover">
        <MdBrightness1 />
      </Icon>{" "}
    </div>
  </ActionTooltip>
);

const ActionTooltip = props => (
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
      margin: "32px"
    }}
  >
    {props.children}
    <div
      style={{
        position: "absolute",
        height: "100%",
        top: 0,
        right: "-24px",
        fontSize: "32px",
        lineHeight: "32px",
        display: "flex",
        alignItems: "center",
        color: "#202020"
      }}
    >
      <FaPlay />
    </div>
  </div>
);

export default SettingsView;
