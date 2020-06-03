## dual-captions <br/> Subtitles in two languages for YouTube, Netflix, Disney+ & Kanopy
![build](https://travis-ci.com/mikesteele/dual-captions.svg?branch=master)

### <a href="https://github.com/mikesteele/dual-captions/releases">View latest release notes</a>

***

### How does it work?

This extension works by intercepting caption file requests, parsing them, and rendering them onto the page.

The extension runs an adapter on the host site repeatedly to get up-to-date information about the state of the host. Adapters are functions that use DOM queries. You can find them in `site_integrations`.

This extension does **not** use any internal APIs on the host site (eg. `window.netflix.appContext`) and it does not change any of the host sites own code. (eg. manipulating the host site's video player bundle)

Why not?

* It is fragile to inject code into the host site bundle.
* It is fragile to rely on internal APIs that may change.
* Adapters that only rely on DOM selectors allow us to fix host site changes quickly.
* Tiny adapters allow for many websites to be supported.

The adapter API is still a work in progress and will be documented in the future. 

This "hands off" approach has UX trade-offs, like requiring the user select a language on the host site to have the caption file requested. I believe long-term stability is more important than UX.

### Manual Installation

Building the extension locally requires having Node and Yarn installed. See https://nodejs.org/ and https://yarnpkg.com/ for installation steps.

1. Build the extension

````
chmod u+x ./build-extension.sh
./build-extension.sh
````

2. Load the /build/ directory as an unpacked extension in chrome://extensions

You'll need to enable Developer Mode in chrome://extensions to do this. See https://developer.chrome.com/extensions/getstarted#unpacked for more information.

### Run Tests

```
cd browser_action
yarn test

cd content_script
yarn test

cd site_integrations
yarn test
```

### Thanks

* tamama9527 (https://github.com/tamama9527) for Traditional Chinese translations for the UI

### License

MIT
