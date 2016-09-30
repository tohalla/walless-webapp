/* eslint-disable import/no-commonjs */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
})
  .listen(3000, '127.0.0.1', err => {
    if (err) {
      return err;
    }
    return true;
  }
);
