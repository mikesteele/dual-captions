import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Tabs, WhiteSpace, Badge, Modal, List, Switch, Picker } from 'antd-mobile';

const Fade = props => (
  <div
    style={{
      filter: props.in ? 'opacity(1)' : 'opacity(0)',
      transition: 'filter 200ms',
      pointerEvents: props.in ? 'auto' : 'none',
    }}
  >
    { props.children }
  </div>
);

function withTimer(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        time: 0
      }
    }

    componentDidMount() {
      this.timer = setInterval(() => {
        this.setState({
          time: Date.now()
        });
      }, 100);
    }

    componentWillUnmount() {
      clearInterval(this.timer);
    }

    render() {
      return (
        <WrappedComponent
         {...this.props}
         time={this.state.time}
        />
      );
    }
  };
}

const Dialog = withTimer(props => {
  const wrapperStyles = {
    position: 'fixed',
    zIndex: 2000,
    top: 0,
    left: 0,
    width: '80%',
    height: '100px',
    background: 'white',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    margin: '5%',
    padding: '5%',
    textAlign: 'center'
  };
  const host = document.querySelector('.am-picker-popup-wrap');
  const isSecondSubtitlePicker = document.querySelector('.am-picker-popup-title') && document.querySelector('.am-picker-popup-title').textContent === 'Second Subtitle Language';
  if (host && isSecondSubtitlePicker) {
    return ReactDOM.createPortal((
      <div style={wrapperStyles}>
        {props.children}
      </div>
    ), host);
  } else {
    return null;
  }

});

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingTutorialOpen: false,
      isLanguagePickerOpen: false,
    };
  }

  render() {
    const {
      isLoadingTutorialOpen,
      isLanguagePickerOpen
    } = this.state;
    return (
      <Fragment>
        <Modal
          visible={isLoadingTutorialOpen}
          onClose={() => {}}
          transparent
          title="Title"
          footer={[{ text: 'Ok', onPress: () => { console.log('ok'); } }]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          afterClose={() => { alert('afterClose'); }}
        >
          I'm the loading tutorial
        </Modal>
        <Dialog>
          You'll need to load subtitles on the page to see them here.
          <button onClick={() => {
            this.setState({
              isLanguagePickerOpen: false,
            })
          }}>
            Show me
          </button>
        </Dialog>
        <List
          renderHeader={() => 'Dual Captions v2.3.4'}
          extra=" "
          >
          <List.Item
            extra={<Switch
              checked
            />}
          >Turn on</List.Item>
          <div onClick={() => {
            this.setState({
              isLanguagePickerOpen: true,
            })
          }}>
            <Picker
              data={[0, 0, 0]}
              onOk={e => {
                this.setState({
                  isLanguagePickerOpen: false,
                })
              }}
              onDismiss={() => {
                this.setState({
                  isLanguagePickerOpen: false,
                })
              }}
              okText="Ok"
              value={[0, 0, 0]}
              extra=" "
              dismissText="Dismiss"
              title="Second Subtitle Language"
              disabled={false}
            >
              <List.Item arrow="horizontal">Second Subtitle Language</List.Item>
            </Picker>
            <Picker
              data={[0, 0, 0]}
              onOk={e => {
                this.setState({
                  isLanguagePickerOpen: false,
                })
              }}
              onDismiss={() => {
                this.setState({
                  isLanguagePickerOpen: false,
                })
              }}
              okText="Ok"
              value={[0, 0, 0]}
              extra="🇺🇸"
              dismissText="Dismiss"
              title="UI Lang"
              disabled={false}
            >
              <List.Item arrow="horizontal">UI Language</List.Item>
            </Picker>
          </div>
        </List>
      </Fragment>
    )
  }
}


export default MainPage;
