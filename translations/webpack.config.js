const webpack = require('webpack');

module.exports = {
  target: 'node',
  entry: './index.js',
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs'
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
