import React, { Fragment } from 'react';
import { List, Picker, NoticeBar, Icon } from 'antd-mobile';

const Footer = () => (
  <Fragment>
    <NoticeBar mode="link" icon={"✨"} onClick={() => alert('1')}>
      What's new in v2.3.4?
    </NoticeBar>
  </Fragment>
);

export default Footer;
