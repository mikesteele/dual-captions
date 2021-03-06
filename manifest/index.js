const fs = require('fs');
const Integrations = require('dual-captions-site-integrations').integrations;
const packageJson = require('./package');

const manifest = {
  "name": "Two Captions for YouTube & Netflix",
  "description": "Show subtitles in two languages on Youtube & Netflix",
  "version": packageJson.version,
  "permissions": [
    "tabs",
    "http://*/*",
    "https://*/*",
    "storage",
    "webRequest"
  ],
  "background": {
    "scripts": [
      "background.js"
    ]
  },
  "browser_action": {
    "default_title": "Show two captions",
    "default_icon": "icon.png",
    "default_popup": "index.html"
  },
  "content_scripts": [{
    "all_frames": false,
    "js": [
      "bundle.js"
    ]
   }],
  "icons": {
    "16": "icon.png",
    "48": "icon-48.png",
    "128": "icon-128.png"
  },
  "manifest_version": 2
};

manifest.content_scripts[0].matches = Integrations.map(i => {
  return i.injectPattern || null
}).filter(p => !!p);

if (!fs.existsSync("build")) {
  fs.mkdirSync("build");
}

fs.writeFileSync('./build/manifest.json', JSON.stringify(manifest, 4, ' '));
