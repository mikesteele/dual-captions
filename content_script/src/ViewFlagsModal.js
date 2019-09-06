import React, { Fragment } from 'react';
import Modal from './Modal';

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
      background: 'black',
      color: 'white',
      overflow: 'auto',
      boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.5)',
      padding: '32px',
      fontSize: '16px',
      borderRadius: '2px'
    }
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <div style={containerStyle}>
          {settings.favorites.map(caption => (
            <div>
              <div>{caption[0]}</div>
              <div>{caption[1]}</div>
            </div>
          ))}
        </div>
      </Modal>
    )
  }
}

export default ViewFlagsModal;
