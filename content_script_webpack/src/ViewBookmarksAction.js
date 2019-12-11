import React, { Fragment } from 'react';
import ActionButton from './ActionButton';
import Modal from './Modal';
import { MdBook } from 'react-icons/md';
import translate from './utils/translate';

class ViewBookmarksAction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      openViewBookmarksModal,
      settings,
      adapter,
      isOn,
      videoId
    } = this.props;
    const t = key => translate(settings.uiLanguage, key);
    return (
      <Fragment>
        <ActionButton
          onClick={openViewBookmarksModal}
          tooltipText={t('view-all-bookmarks')}
          settings={settings}
          adapter={adapter}
          isOn={isOn}
          videoId={videoId}
        >
          <MdBook />
        </ActionButton>
      </Fragment>
    )
  }
}

export default ViewBookmarksAction;
