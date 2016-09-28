/* eslint-disable import/no-commonjs */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  proxy: {
    '/api/*': {
      secure: false,
      target: 'http://127.0.0.1:8080'
    }
  }
})
  .listen(3000, '127.0.0.1', err => {
    if (err) {
      return err;
    }
    return console.log('Listening at http://127.0.0.1:3000/');
  }
);
