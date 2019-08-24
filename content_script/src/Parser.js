import NetflixParser from './parsers/netflix';
import YoutubeParser from './parsers/youtube';
import EdxParser from './parsers/edx';

const Parser = (props) => {
  const parse = (captionFile, currentSite) => {
    if (currentSite === 'netflix') {
      return NetflixParser.parse(captionFile);
    } else if (currentSite === 'youtube') {
      return YoutubeParser.parse(captionFile);
    } else if (currentSite === 'edx') {
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
