import React from 'react';
import config from '../config';
import { translate } from 'react-i18next';
import { sendMessageToActiveTab } from '../utils/chrome';

const Link = props => (
  <button {...props} style={{
    appearance: 'none',
    '-webkit-appearance': 'none',
    color: '#2980b9',
    textDecoration: 'underline',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    fontSize: '14px'
  }}/>
);

class ToolsPage extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.onFileInputChange = this.onFileInputChange.bind(this);
    this.onClickUpload = this.onClickUpload.bind(this);
    this.state = {
      canUpload: false
    }
  }

  onFileInputChange() {
    if (this.inputRef && this.inputRef.current) {
      const canUpload = this.inputRef.current.files.length > 0;
      this.setState({
        canUpload
      })
    }
  }

  onClickUpload() {
    if (this.inputRef && this.inputRef.current) {
      const file = this.inputRef.current.files[0];
      file.text().then(text => {
        sendMessageToActiveTab({
          type: 'process-caption-file',
          payload: text
        }).then(() => {
          // No-op
        }).catch(err => {
          // TODO - Handle
        });
      }).catch(err => {
        // TODO - Handle
      });
    }
  }

  render() {
    const {
      loadedLanguages,
      t
    } = this.props;
    const onClickLang = (lang) => {
      sendMessageToActiveTab({
        type: 'download-subtitles',
        payload: lang
      }).then(() => {
        // No-op
      }).catch(err => {
        console.error(err);
      });
    };
    return (
      <div className='page'>
        <div className='column'>
        {t('download-subtitles')}
        {loadedLanguages.map(lang => (
          <Link onClick={() => onClickLang(lang)}>
            {config.secondLanguages[lang]}
          </Link>
        ))}
        </div>
        <div className='tools-page-spacer'/>
        <div className='column'>
          {t('upload-subtitles')}
          <input
            type='file'
            ref={this.inputRef}
            onChange={this.onFileInputChange}
          />
          <button
            disabled={!this.state.canUpload}
            onClick={this.onClickUpload}
          >{t('upload')}</button>
        </div>
      </div>
    )
  }
}


export default translate()(ToolsPage);
