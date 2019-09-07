import React, { Fragment } from 'react';
import Modal from './Modal';
import { MdClose, MdCheckBoxOutlineBlank, MdCheckBox, MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import FlagAction from './FlagAction';

const Button = props => {
  const style = {
    backgroundColor: '#bb86fc',
    color: 'white',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    transition: '200ms',
    display: 'inline-block',
    padding: '16px',
    borderRadius: '4px',
    margin: '8px'
  }

  if (props.disabled) {
    style.filter = 'brightness(0.5)';
  }

  return (
    <div
      class='dc-button'
      style={style}
      onClick={props.onClick}
    >
      { props.children }
    </div>
  )
}


class ViewFlagsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCaptions: [],
    }

    this.selectCaption = this.selectCaption.bind(this);
    this.deselectCaption = this.deselectCaption.bind(this);

    this.copySelectedCaptionsToClipboard = this.copySelectedCaptionsToClipboard.bind(this);
    this.removeSelectedCaptions = this.removeSelectedCaptions.bind(this);
  }

  copySelectedCaptionsToClipboard() {
    const {
      selectedCaptions
    } = this.state;
    const text = selectedCaptions.map(caption => {
      return `\n\n\n${caption[0]}\n${caption[1]}\n\n\n`
    }).join('');
    navigator.clipboard.writeText(text)
      .then(() => {})
      .catch(err => {
        console.error(`Couldn't copy to clipboard: ${err}`);
      });
  }

  removeSelectedCaptions() {
    const {
      settings
    } = this.props;
    const {
      selectedCaptions
    } = this.state;
    settings.removeFromBookmarks(selectedCaptions);
    this.setState({
      selectedCaptions: []
    });
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
      settings,
      adapter,
      currentCaptionToRender
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
    const buttonGroupStyles = {
      marginTop: '32px'
    }

    const buttonsAreDisabled = selectedCaptions.length === 0;
    const onClickClipboardButton = buttonsAreDisabled ? undefined : this.copySelectedCaptionsToClipboard;
    const onClickRemoveButton = buttonsAreDisabled ? undefined : this.removeSelectedCaptions;

    const hasSavedCaptions = settings.bookmarks.length > 0;

    const hasSavedCaptionsModalBody = (
      <Fragment>
        <div style={headingStyle}>
          <span>Bookmarks</span>
          <span onClick={onClose} style={{cursor: 'pointer'}}><MdClose /></span>
        </div>
        <div style={tableStyle}>
          <div style={rowContainerStyle}>
            {settings.bookmarks.map((caption, index) => {
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
        <div style={buttonGroupStyles}>
          <Button onClick={onClickClipboardButton} disabled={buttonsAreDisabled}>
            Copy to clipboard
          </Button>
          <Button onClick={onClickRemoveButton} disabled={buttonsAreDisabled}>
            Delete
          </Button>
        </div>
      </Fragment>
    );

    const noSavedCaptionsModalBody = (
      <Fragment>
        <div style={headingStyle}>
          <span>Bookmarks</span>
          <span onClick={onClose} style={{cursor: 'pointer'}}><MdClose /></span>
        </div>
        <div style={{
          fontSize: '20px',
          lineHeight: '32px'
        }}>
          <div>
            <span>Use the bookmark action&nbsp;</span>
            <span style={{
              padding: '4px',
              border: '1px solid white',
              borderRadius: '50%',
              display: 'inline-flex',
              flexDirection: 'column'
            }}>
              <MdBookmarkBorder/>
            </span>
            <span>&nbsp;to save captions for later.</span>
          </div>
          <div>You can also use the hot key Alt/Option + A.</div>
          <div>Captions you save will show here.</div>
        </div>
      </Fragment>
    );

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <div style={containerStyle} onClick={onClickContainer}>
          { hasSavedCaptions ? hasSavedCaptionsModalBody : noSavedCaptionsModalBody }
        </div>
      </Modal>
    )
  }
}

export default ViewFlagsModal;
