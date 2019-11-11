import NetflixParser from './parsers/netflix';
import YoutubeParser from './parsers/youtube';
import EdxParser from './parsers/edx';

const Parser = (props) => {
  const { site } = props;
  const parse = (captionFile) => {
    if (site === 'netflix') {
      return NetflixParser.parse(captionFile);
    } else if (site === 'youtube') {
      return YoutubeParser.parse(captionFile);
    } else if (site === 'edx') {
      return EdxParser.parse(captionFile);
    } else {
      return Promise.reject('Site not supported.'); // TODO
    }
  };
  const parser = {
    parse
  };
  return props.children(parser);
};

export default Parser;
