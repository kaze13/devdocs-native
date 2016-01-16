var path = require('path')
var webpack = require('webpack')
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

var options = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: __dirname
    },
      {
        test: /\.jsx$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname
      }, {
        test: /\.css?$/,
        loaders: ['style', 'raw'],
        include: __dirname
      }]
  }
}
options.target = webpackTargetElectronRenderer(options)

module.exports = options;

