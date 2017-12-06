/* eslint-disable import/no-commonjs */
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch'
    ]
  },
  devtool: 'eval',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
};
