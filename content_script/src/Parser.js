import NetflixParser from './parsers/netflix';
import YoutubeParser from './parsers/youtube';
import { getIntegrationForSite } from './utils/integrations';

const Parser = (props) => {
  const { site } = props;
  const parse = (captionFile) => {
    const integration = getIntegrationForSite(site);
    if (integration && integration.parser) {
      return integration.parser(captionFile);
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
