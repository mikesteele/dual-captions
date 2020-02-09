const YouTubeJSONParser = require('./parsers/JSONParser');
const YouTubeLegacyXMLParser = require('./parsers/LegacyXMLParser');

// TODO - contentType
const YouTubeParser = (captionFile, contentType) => {
  if (contentType.includes('application/json')) {
    return YouTubeJSONParser(captionFile);
  } else {
    // 2/9/20
    // Seems like YouTube retroactively changed all caption files to JSON
    // Keeping this just in case
    return YouTubeLegacyXMLParser(captionFile);
  }
}

module.exports = YouTubeParser;
