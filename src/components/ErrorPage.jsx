import React, { Component } from 'react';
import { translate } from 'react-i18next';

/**

Error types:

'no-dc': DC not found on page.
'no-player': DC couldn't observe because getPlayer didn't return an element.
'automatic-captions': DC saw automatic captions, which it can't support. (YouTube only)
'image-captions': DC saw image captions, which it can't support. (Netflix only)

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
      <div hidden={!this.props.hasError}>
        <div className='modal'>
          <span className='alert-icon'></span>
          <span className='error-text'>{this.props.t(this.props.errorType)}</span>
          <span
            className='dismiss-icon'
            onClick={this._onClickDismiss.bind(this)}>
            x
          </span>
        </div>
      </div>
    )
  }
}

export { ErrorPage };
export default translate()(ErrorPage);
