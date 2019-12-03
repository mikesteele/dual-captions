const webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: './index.js',
  output: {
    filename: 'index.js',
    libraryTarget: 'window'
  },
  module: {
    rules: [{
      test: /\.js?$/,
      loader: 'babel-loader',
      query: {
        presets: ['@babel/preset-env']
      }
    }]
  }
}
