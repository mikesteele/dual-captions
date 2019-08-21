## dual-captions <br/> Subtitles in two languages for YouTube & Netflix
![build](https://travis-ci.com/mikesteele/dual-captions.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/mikesteele/dual-captions/badge.svg)](https://coveralls.io/github/mikesteele/dual-captions)

| YouTube      | Netflix       |
|:-------------:|:-------------:|
| <img src="https://raw.githubusercontent.com/mikesteele/dual-captions-gifs/master/youtube.png"> | <img src="https://raw.githubusercontent.com/mikesteele/dual-captions-gifs/master/netflix.png"> |

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

### License

MIT
