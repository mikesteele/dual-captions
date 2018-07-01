# Creating a Custom Adaptor (draft)

In this tutorial, I'll be creating a custom adaptor for **Amazon Prime video**.

I use the term _adaptor_ in this tutorial. An adaptor is an instance of a DualCaptionsConfig. As of 6/1/2018, adaptors are found in `public/content-scripts/config`. Eventually, I'd like to rename the base adaptor to DualCaptionsAdaptor and the directory the adaptors are stored in to `public/content-scripts/adaptors`.

## 1. Setup

You should have the dual-captions repo cloned, as well as have Node and Yarn installed. See https://github.com/mikesteele/dual-captions/blob/master/.travis.yml for the Node version the build currently uses.

## 2. Create the adaptor, inject it on Amazon Prime video

Start by creating the adaptor by making a new file in `public/content-scripts/config` called `amazon-prime.js`. All adaptors extend the base adaptor, DualCaptionsConfig.

`public/content-scripts/config/amazon-prime.js`
```
class AmazonPrimeConfig extends DualCaptionsConfig {

}

window.DC.config = new AmazonPrimeConfig();
```

Next, we want to inject this adaptor when we're on Amazon Prime video. Open `public/manifest.json` and add a new case to the `content_scripts` array:

`public/manifest.json`
```
{
  "name": "Two Captions for YouTube & Netflix",
  "description": "Show subtitles in two languages on Youtube and Netflix",
  "version": "1.3.2",
  "permissions": [
    "tabs", "http://*/*", "https://*/*", "storage"
  ],
  "browser_action": {
      "default_title": "Show dual captions",
      "default_icon": "icon.png",
      "default_popup": "index.html"
  },
  "content_scripts": [{
    "all_frames": false,
    "css": [
      "content-scripts/config/init.css"
    ],
    "js": [
      "content-scripts/init.js",
      "content-scripts/google-translate-token.js",
      "content-scripts/querystring-encode.js",
      "content-scripts/google-translate-api.js",
      "content-scripts/config/init.js",
      "content-scripts/config/youtube.js",
      "content-scripts/dual-captions.js"
    ],
    "matches": [ "https://www.youtube.com/*" ]
   },{
    "all_frames": false,
    "css": [
      "content-scripts/config/init.css",
      "content-scripts/config/netflix.css"
    ],
    "js": [
      "content-scripts/init.js",
      "content-scripts/google-translate-token.js",
      "content-scripts/querystring-encode.js",
      "content-scripts/google-translate-api.js",
      "content-scripts/config/init.js",
      "content-scripts/config/netflix.js",
      "content-scripts/dual-captions.js"
    ],
    "matches": [ "https://www.netflix.com/*" ]
   }, {
    "all_frames": false,
    "css": [
      "content-scripts/config/init.css"
    ],
    "js": [
      "content-scripts/init.js",
      "content-scripts/google-translate-token.js",
      "content-scripts/querystring-encode.js",
      "content-scripts/google-translate-api.js",
      "content-scripts/config/init.js",
      "content-scripts/config/amazon-prime.js",
      "content-scripts/dual-captions.js"
    ],
    "matches": [ "https://www.amazon.com/*" ]
   }],
  "icons": {
    "16": "icon.png",
    "48": "icon-48.png",
    "128": "icon-128.png"
  },
  "manifest_version": 2
}
```

Note that the only difference between configurations is the adaptor. (`youtube.js`, `netflix.js`, and now `amazon-prime.js`)

Next we'll build the extension:
```
yarn build
```
Then, load the `/build/` as an unpacked extension in `chrome://extensions`. See https://developer.chrome.com/extensions/getstarted#unpacked for help on that.

Let's take a look at what happens when we log on to Amazon Prime video and try to turn on DC:
<img src="https://raw.githubusercontent.com/mikesteele/dual-captions-gifs/master/screenshot-1.png">

Two things look wrong here: there's no Step 1 text in the popup and we got an error saying it couldn't find the video player on the page.

## 3. Connect the player to the adaptor

To get a "Step 1" in the popup, the adaptor needs to have a site.

`public/content-scripts/config/amazon-prime.js`
```
class AmazonPrimeConfig extends DualCaptionsConfig {
  constructor() {
    super();
    this.site = 'amazon';
  }
}

window.DC.config = new AmazonPrimeConfig();
```

Next, we need to implement `getPlayer()`, which should return the video player element. Inspecting the Amazon Prime video DOM, the player has an ID of `dv-web-player`. 

`public/content-scripts/config/amazon-prime.js`
```
class AmazonPrimeConfig extends DualCaptionsConfig {
  constructor() {
    super();
    this.site = 'amazon';
  }
  
  getPlayer() {
    return document.getElementById('dv-web-player');
  }
}

window.DC.config = new AmazonPrimeConfig();
```


