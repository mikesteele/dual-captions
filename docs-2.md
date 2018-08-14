## Observer

The Observer is the heart of Dual Captions.

At its simplest, it watches for new captions to appear, translates them, and adds the translated caption underneath.

The Observer is responsible for:

1. Managing the MutationObserver that watches for new captions to be added to the DOM.
2. Translating new captions when they are added to the DOM.
3. Responding to messages sent from the Dual Captions pop-up.
4. Avoiding adding the same caption to the DOM multiple times.
5. Making as few calls to translate API as possible, by leveraging a TranslationCache.

File: /lib/dual-captions.js

## Adapter

Adapters are site-specific. They know which element is the player, what makes an element a caption, and where to append translated captions.

The Adapter is responsible for:

1. Querying the player that the ObserverContoller will observe.
2. Providing a way to indentify if a MutationRecord means a caption was added to the DOM.
3. Styling a translated caption to match the true captions.
4. Appending a translated caption to the DOM.

## TranslationProvider

## TranslationParser

A TranslationParser takes a response body and returns a Translation object.



## TranslationFetcher

## Translator

A Translator takes text and a target language and returns a Promise for translated text.

A Translator could call an API (like the GoogleTranslator, which uses the Google Translate API) or it could use a library. (like the PinyinTranslator, which uses <link>pinyin</link>)

Translators are called by the TranslationProvider.

### Relevant files

Translators are stored in:

```

public/content-scripts/translators/

```

### Methods

#### translate(text:String, language?:String) => Promise(String)

Example:

````
/**

A simple Translator that returns the text with a smiley at the end.

Ex. "Hello" => "Hello :-)"

**/

class SmileyTranslator extends Translator {
  translate(text, language) {
  	return Promise.resolve(`${text} :-)`);
  }
}

window.DC.SmileyTranslator = new SmileyTranslator();
````

We can create a new language "Smiley".

In `src/languages.js`

```
  'Spanish': 'es',
  'Smiley': '__DC:smiley'
```

In Provider/useCustomTranslator

```
// Called for any language '__DC:xxx'
useCustomTranslator(text, language) {
  switch (language) {
  	case: '__DC:romaji':
  	return window.DC.RomajiTranslator.translate(text);
  	break;

  	case: '__DC:pinyin':
  	return window.DC.PinyinTranslator.translate(text);
  	break;

  	case: '__DC:smiley':
  	return window.DC.SmileyTranslator.translate(text);
  	break;

  	default:
  	return Promise.reject(`Couldn't find custom translator for ${language}`);
  	break;
  }
}

```


TODO - Remove

Provider re-write:

```

  translate(text, language, currentTime, useCaptionsFromVideo) {
  	const isCustomLanguage = /^__DC:/g.test(language);
  	return new Promise((resolve, reject) => {
  	  if (isCustomLanguage) {
  	  	this.useCustomTranslator(text, language)
  	  	  .then(resolve)
  	  	  .catch(reject);
  	  }
  	  this.staticTranslator.translate(text)
  	    .then(resolve)
  	    .catch(err => {
  	      console.log(`Couldn't use static translations - ${err}`)
  	      this.fallbackTranslator
            .translate(text, language, currentTime)
            .then(resolve)
            .catch(reject);
  	    });
  	});
  });



```

## Background Page

`public/background.js`
