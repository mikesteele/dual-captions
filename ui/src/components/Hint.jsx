import React, { Component } from 'react';
import { I18n, Trans } from 'react-i18next';

/**

TODO
----

- Should use the current site
- Should use the correct icon
- Should be able to produce generic hint if user is using custom config

**/

class Hint extends Component {
  render() {
    return (
      <I18n namespace='translations'>
      {
        (t) => (
          <div className='hint'>
            {t('hint-text')}
          </div>
        )
      }
      </I18n>
    )
  }
}

export default Hint;
