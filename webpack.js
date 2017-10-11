/* eslint-disable import/no-commonjs */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config');

module.exports = props =>
  new WebpackDevServer(webpack(config), Object.assign({
    publicPath: config.output.publicPath,
    hot: true,
    inline: true,
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  }, props))
    .listen(3001, '127.0.0.1', err => {
      if (err) {
        return err;
      }
      return true;
    }
  );
