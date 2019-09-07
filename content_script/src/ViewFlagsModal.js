import React, { Fragment } from 'react';
import Modal from './Modal';
import { MdClose, MdCheckBoxOutlineBlank, MdCheckBox, MdBookmark } from 'react-icons/md';

const Button = props => (
  <div
    style={{
      backgroundColor: props.disabled ? '#bb86fc' : 'black',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 200ms',
      display: 'inline-block',
      padding: '16px',
      borderRadius: '4px'
    }}
    onClick={props.onClick}
  >
    { props.children }
  </div>
)

class ViewFlagsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCaptions: [],
    }

    this.selectCaption = this.selectCaption.bind(this);
    this.deselectCaption = this.deselectCaption.bind(this);
  }

  selectCaption(text1, text2) {
    this.setState(state => ({
      selectedCaptions: [
        ...state.selectedCaptions,
        [text1, text2]
      ]
    }));
  }

  deselectCaption(text1, text2) {
    this.setState(state => {
      const newSelectedCaptions = state.selectedCaptions;
      const index = newSelectedCaptions.findIndex(pair => {
        return pair[0] === text1 && pair[1] === text2;
      });
      if (index >= 0) {
        newSelectedCaptions.splice(index, 1);
      }
      return ({
        selectedCaptions: newSelectedCaptions
      });
    });
  }

  render() {
    const {
      isOpen,
      onClose,
      settings
    } = this.props;
    const {
      selectedCaptions
    } = this.state;
    const containerStyle = {
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
      fontSize: '24px',
      cursor: 'pointer'
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
                const isSelected = selectedCaptions.some(pair => {
                  return pair[0] === caption[0] && pair[1] === caption[1];
                });
                const icon = isSelected ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />;
                const onClick = isSelected ? () => {
                  this.deselectCaption(caption[0], caption[1]);
                } : () => {
                  this.selectCaption(caption[0], caption[1]);
                };
                return (
                  <div style={rowStyle} key={`${caption[0]}|${caption[1]}`}>
                    <div onClick={onClick} style={iconStyle}>
                      {icon}
                    </div>
                    <div>{caption[0]}</div>
                    <div>{caption[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <Button onClick={() => {}} disabled={selectedCaptions.length === 0}>
            Copy {selectedCaptions.length} {selectedCaptions.length === 1 ? 'caption' : 'captions'} to clipboard
          </Button>
          <Button onClick={() => {}} disabled={selectedCaptions.length === 0}>
            Delete {selectedCaptions.length} {selectedCaptions.length === 1 ? 'caption' : 'captions'}
          </Button>
        </div>
      </Modal>
    )
  }
}

export default ViewFlagsModal;
