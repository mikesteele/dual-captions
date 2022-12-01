## This project is now archived (12/1/22)

When I created this project, it was just for myself to learn French on YouTube. I never imagined it would reach over 30,000 installs and over 200 stars. Thank you for your support over the years. 

I cannot commit to maintaining this project going forward due to other priorities in my personal life. Thank you for understanding. The code will be kept up so that others can create and maintain forks if they choose to.

-- Mike

## dual-captions <br/> Subtitles in two languages for YouTube, Netflix, Disney+ & Kanopy
![build](https://travis-ci.com/mikesteele/dual-captions.svg?branch=master)

### :arrow_down: <a href="https://chrome.google.com/webstore/detail/two-captions-for-youtube/lpeonmjfimoijceaalocpgjjchocbiap/related">Download on Chrome Web Store</a>
### :closed_book: <a href="https://github.com/mikesteele/dual-captions/releases">View latest release notes</a>

<img src="https://raw.githubusercontent.com/mikesteele/dual-captions-gifs/master/screenshot-final.png" width="100%" />

***

### How does it work?

#### Site integrations

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

#### Saving settings across sessions

Since `browser_action`s cannot persist any data after they are closed, this extension uses Redux middleware to store the user's settings with `chrome.storage` on any change. When the popup is re-opened, the store is re-hydrated with the user's saved store settings, and settings are injected into the `content_script`.

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
