This is a WIP rewrite of https://github.com/mikesteele/dual-captions/.

Instead of injecting individual content scripts, this rewrite injects a bundled React app into the page.

## Why rewrite?

There are a number of open issues in dual-captions that I think a rewrite would solve.

### Re-rendering on video time change

Even though they are from the same video, caption files of different languages may not match up. Relying on DOM mutations, as v1 does, doesn't always work.

See https://github.com/mikesteele/dual-captions/issues/55 and https://github.com/mikesteele/dual-captions/issues/68

In this rewrite, we re-render second subtitles on DOM mutation and current time changes.

### Utilizing third-party positioning libraries

The long-term vision of dual-captions is to support hundreds of video sites. That requires a simple adapter API.

The v1 adapter API works OK in simpler SPAs, like YouTube. See https://github.com/mikesteele/dual-captions/blob/master/public/content-scripts/youtube/adapter.js

It's messier in complex SPAs, like Netflix. See https://github.com/mikesteele/dual-captions/blob/master/public/content-scripts/netflix/adapter.js

The Netflix Adapter is messy because of the lack of third-party positioning libraries, like https://github.com/HubSpot/tether. Re-writing the injected bundle to React will make including third-party libraries easier.

v2 adapters can be found here: https://github.com/mikesteele/dc2/blob/master/src/adapters/ (API is not final)

### Rendering second subtitles in a different root

The v1 adapters render directly into DOM controlled by the third-party video site. This requires the v1 observer to keep track of whether what it has rendered has been overwritten by the third-party's own rendering logic.

By rendering into a seperate root, v2 doesn't have to worry about being rendered over.

This also fixes the long-standing issue with Chinese, Japanese and Korean subtitles on Netflix. These three languages are rendered as SVG on Netflix, which isn't easy for the v1 adapters to render into. By rendering in a separate root, it doesn't matter what the caption window is. See https://github.com/mikesteele/dual-captions/issues/48.

## Building

See the README in https://github.com/mikesteele/dc2-build for instructions on building dc2.
