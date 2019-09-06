import React, { Fragment } from 'react';
import Modal from './Modal';
import { MdClose, MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';

class ViewFlagsModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      isOpen,
      onClose,
      settings
    } = this.props;
    const containerStyle = {
      width: '50%',
      height: '50%',
      background: '#0d0d0d',
      color: '#E1E1E1',
      boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.5)',
      padding: '32px',
      fontSize: '16px',
      lineHeight: '20px',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column'
    }
    const headingStyle = {
      fontSize: '24px',
      lineHeight: '28px',
      marginBottom: '32px',
      display: 'flex',
      justifyContent: 'space-between'
    }
    const rowStyle = {
      borderTop: '1px solid white',
      borderBottom: '1px solid white',
      padding: '16px'
    }
    const tableStyle = {
      overflow: 'auto',
      borderRadius: '4px'
    }
    const rowContainerStyle = {

    }
    const evenRowStyles = {
      padding: '16px',
      backgroundColor: '#202020'
    }
    const oddRowStyles = {
      padding: '16px',
      backgroundColor: '#151515'
    }
    const onClickContainer = e => {
      e.stopPropagation();
    };
    const iconStyle = {
      color: '#bb86fc',
      fontSize: '24px'
    };
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <div style={containerStyle} onClick={onClickContainer}>
          <div style={headingStyle}>
            <span>Flags</span>
            <span onClick={onClose} style={{cursor: 'pointer'}}><MdClose /></span>
          </div>
          <div style={tableStyle}>
            <div style={rowContainerStyle}>
              {settings.favorites.map((caption, index) => {
                const rowStyle = index % 2 === 0 ? evenRowStyles : oddRowStyles;
                return (
                  <div style={rowStyle} key={`${caption[0]}|${caption[1]}`}>
                    <span style={iconStyle}><MdCheckBox /></span>
                    <div>{caption[0]}</div>
                    <div>{caption[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default ViewFlagsModal;
