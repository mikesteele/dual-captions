class YouTubeTranslationParser extends TranslationParser {
  parse(text) {
    return Promise.reject('TODO - YouTubeTranslationParser.parse');
  }
}

window.DC.parser = new YouTubeTranslationParser();
