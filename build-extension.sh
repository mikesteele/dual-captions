#!/usr/bin/env bash

# Clean
rm -rf build/

# Link translations
cd translations
yarn link

# Build browser_action
cd ..
cd browser_action
yarn
yarn link dual-captions-translations
yarn build
yarn link

# Build content_script
cd ..
cd content_script
yarn link dual-captions-translations
yarn
yarn build

# Create extension
cd ..
mkdir build
cp -r browser_action/build/* build/
cp content_script/build/static/js/main.js build/bundle.js
cp content_script/build/background.js build/background.js
cp content_script/build/manifest.json build/manifest.json
