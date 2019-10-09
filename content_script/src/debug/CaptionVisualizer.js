import React from 'react';
import enCaptionFile from './assets/homes-en-cc';
import frCaptionFile from './assets/homes-fr';

const SCALE = 100;
const scale = num => num * SCALE;

const Viewer = props => {
  const { captions, setFeaturedCaption } = props;
  if (!captions.length) {
    return null;
  }
  const beginPadding = captions[0].startTime;
  const format = caption => `
    ${caption.text}\n
    ${caption.startTime}\n
    ${caption.endTime}\n
  `;
  return (
    <div style={{
      height: 50,
      background: 'white',
      marginBottom: 50,
      display: 'flex',
      position: 'relative'
    }}>
      {captions.map((caption, i) => {
        if (i < captions.length - 1) {
          return (
            <div
              key={i}
              style={{
                background: 'pink',
                height: 50,
                position: 'absolute',
                left: scale(caption.startTime),
                width: scale(caption.endTime - caption.startTime),
                flex: 'none',
                border: '1px solid green'
              }}
              onMouseOver={() => setFeaturedCaption(format(caption))}
              onMouseOut={() => setFeaturedCaption('')}
            />
          );
        }
      })}
    </div>
  );
}

class CaptionVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enCaptions: [],
      frCaptions: [],
      featuredCaption: ''
    }
  }

  componentDidMount() {
    const { parser } = this.props;
    parser.parse(enCaptionFile).then(captions => {
      this.setState({
        enCaptions: captions
      });
    }).catch(err => alert(err));
    parser.parse(frCaptionFile).then(captions => {
      this.setState({
        frCaptions: captions
      });
    }).catch(err => alert(err));
  }

  render() {
    const { enCaptions, frCaptions, featuredCaption } = this.state;
    const setFeaturedCaption = s => this.setState({
      featuredCaption: s
    });
    return (
      <div>
        {featuredCaption && (
          <div style={{
            position: 'fixed',
            top: 100,
            left: 200,
            padding: 32
          }}>
            {featuredCaption}
          </div>
        )}
        <Viewer setFeaturedCaption={setFeaturedCaption} captions={enCaptions}/>
        <Viewer setFeaturedCaption={setFeaturedCaption} captions={frCaptions}/>
      </div>
    )
  }
}

export default CaptionVisualizer;
