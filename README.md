## dual-captions <br/> Subtitles in two languages for YouTube, Netflix, Disney+ & Kanopy
![build](https://travis-ci.com/mikesteele/dual-captions.svg?branch=master)

### <a href="https://github.com/mikesteele/dual-captions/releases">View latest release notes</a>

***

#### Manual Installation

Building the extension locally requires having Node and Yarn installed. See https://nodejs.org/ and https://yarnpkg.com/ for installation steps.

1. Build the extension

````
chmod u+x ./build-extension.sh
./build-extension.sh
````

2. Load the /build/ directory as an unpacked extension in chrome://extensions

You'll need to enable Developer Mode in chrome://extensions to do this. See https://developer.chrome.com/extensions/getstarted#unpacked for more information.

#### Run Tests

```
cd browser_action
yarn test

cd content_script
yarn test
```

### Thanks

* tamama9527 (https://github.com/tamama9527) for Traditional Chinese translations for the UI

### License

MIT
