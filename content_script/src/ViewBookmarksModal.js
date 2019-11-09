import React, { Fragment } from 'react';
import Modal from './Modal';
import { MdClose, MdCheckBoxOutlineBlank, MdCheckBox, MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import BookmarkAction from './BookmarkAction';
import translate from './utils/translate';

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


class ViewBookmarksModal extends React.Component {
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
    const tableStyle = {
      overflow: 'auto',
      borderRadius: '4px'
    }
    const evenRowStyles = {
      padding: '16px',
      backgroundColor: '#202020',
      display: 'flex',
      alignItems: 'center'
    }
    const oddRowStyles = {
      padding: '16px',
      backgroundColor: '#151515',
      display: 'flex',
      alignItems: 'center'
    }
    const onClickContainer = e => {
      e.stopPropagation();
    };
    const iconStyle = {
      color: '#bb86fc',
      fontSize: '24px',
      cursor: 'pointer',
      paddingRight: '16px'
    };
    const buttonGroupStyles = {
      marginTop: '32px'
    }

    const buttonsAreDisabled = selectedCaptions.length === 0;
    const onClickClipboardButton = buttonsAreDisabled ? undefined : this.copySelectedCaptionsToClipboard;
    const onClickRemoveButton = buttonsAreDisabled ? undefined : this.removeSelectedCaptions;

    const hasSavedCaptions = settings.bookmarks.length > 0;

    const t = key => translate(settings.uiLanguage, key);

    const hasSavedCaptionsModalBody = (
      <Fragment>
        <div style={tableStyle}>
          <div>
            {settings.bookmarks.map((caption, index) => {
              // TODO - Remove this & just dump local storage
              if (typeof(caption[0]) !== 'string' || typeof(caption[1]) !== 'string') {
                return null;
              }
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
              const isImageCaption = /^blob:/.test(caption[0]);
              const firstCaption = isImageCaption ? (
                // Render the blob URL created by adapter.getCaptionText()
                <img src={caption[0]} onError={() => {
                  // Blob URLs will be revoked when the window unloads
                  // So if previously saved images 404, we remove them.
                  settings.removeFromBookmarks([caption]);
                }}/>
              ) : (
                <div style={{marginBottom: '8px'}}>{caption[0]}</div>
              )
              return (
                <div style={rowStyle} key={`${caption[0]}|${caption[1]}`}>
                  <div onClick={onClick} style={iconStyle}>
                    {icon}
                  </div>
                  <div>
                    {firstCaption}
                    <div>{caption[1]}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={buttonGroupStyles}>
          <Button onClick={onClickClipboardButton} disabled={buttonsAreDisabled}>
            {t('copy-to-clipboard')}
          </Button>
          <Button onClick={onClickRemoveButton} disabled={buttonsAreDisabled}>
            {t('delete')}
          </Button>
        </div>
      </Fragment>
    );

    const noSavedCaptionsModalBody = (
      <Fragment>
        <div style={{
          fontSize: '20px',
          lineHeight: '32px'
        }}>
          <div>
            <span>{t('bookmarks-explanation-1')}</span>
            <span style={{
              padding: '4px',
              border: '1px solid white',
              borderRadius: '50%',
              display: 'inline-flex',
              flexDirection: 'column',
              marginLeft: 16,
            }}>
              <MdBookmarkBorder/>
            </span>
          </div>
          <div>{t('bookmarks-explanation-2')}</div>
          <div>{t('bookmarks-explanation-3')}</div>
        </div>
      </Fragment>
    );

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t('bookmarks')}
      >
        { hasSavedCaptions ? hasSavedCaptionsModalBody : noSavedCaptionsModalBody }
      </Modal>
    )
  }
}

export default ViewBookmarksModal;
