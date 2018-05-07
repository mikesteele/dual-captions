import React, { Component } from 'react';
import { I18n } from 'react-i18next';

/**

Error types:

'no-dc-error': DC not found on page.
'no-player': DC couldn't observe because getPlayer didn't return an element.

**/

class ErrorPage extends Component {
  _onClickDismiss() {
    this.props.dispatch({
      type: 'CHANGE_ERROR',
      payload: {
        hasError: false,
        errorType: ''
      }
    });
  }

  render() {
    return (
      <I18n namespace='translations'>
      {
        (t) => (
          <div hidden={!this.props.hasError}>
            <div className='modal'>
              <span className='alert-icon'></span>
              <span className='error-text'>{t(this.props.errorType)}</span>
              <span
                className='dismiss-icon'
                onClick={this._onClickDismiss.bind(this)}>
                x
              </span>
            </div>
          </div>
        )
      }
      </I18n>
    )
  }
}

export default ErrorPage;
