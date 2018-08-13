class Translator {
  translate(text, language) {
    return Promise.reject('Translator.translate must be implemented');
  }
}

window.Translator = Translator;
