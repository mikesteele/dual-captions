# Creating a Custom Adaptor (draft)

In this tutorial, I'll be creating a custom adaptor for Amazon Prime video.

I use the term _adaptor_ in this tutorial. An adaptor is an instance of a DualCaptionsConfig. As of 6/1/2018, adaptors are found in `public/content-scripts/config`. Eventually, I'd like to rename the base adaptor to DualCaptionsAdaptor and the directory the adaptors are stored in to `public/content-scripts/adaptors`.

## 1. Setup

You should have the dual-captions repo cloned, as well as have Node and Yarn installed. See https://github.com/mikesteele/dual-captions/blob/master/.travis.yml for the Node version the build currently uses.

## 2. Create the adaptor

Start by creating the adaptor by making a new file in `public/content-scripts/config` called `amazon-prime.js`. All adaptors extend the base adaptor, DualCaptionsConfig.

`public/content-scripts/config/amazon-prime.js`
```


```
