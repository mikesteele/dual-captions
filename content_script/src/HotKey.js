import React from 'react';

const ALT_KEY_CODE = 18;

class HotKey extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.altKeyPressed = false;
    this.hotKeyPressed = false;
  }

  onKeyUp(e) {
    if (e.keyCode === this.props.hotKeyCode) {
      this.hotKeyPressed = false;
    }
    if (e.keyCode === ALT_KEY_CODE) {
      this.altKeyPressed = false;
    }
  }

  onKeyDown(e) {
    const { settings, hotKeyCode, callback } = this.props;
    if (e.keyCode === hotKeyCode) {
      this.hotKeyPressed = true;
    }
    if (e.keyCode === ALT_KEY_CODE) {
      this.altKeyPressed = true;
    }
    if (this.hotKeyPressed && this.altKeyPressed && callback && settings.useHotKeys) {
      callback();
    }
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.onKeyDown);
    document.body.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onKeyDown);
    document.body.removeEventListener('keyup', this.onKeyUp);
  }

  render() {
    return null;
  }
}

export default HotKey;
