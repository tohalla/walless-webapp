/* eslint-disable import/no-commonjs */
const webpack = require('webpack');
const rucksack = require('rucksack-css');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/dev-server',
      path.resolve(__dirname, 'src', 'index')
    ],
    vendor: [
      'material-design-icons/iconfont/material-icons.css',
      'normalize.css/normalize.css',
      'material-design-lite/material',
      'react-select/dist/react-select.css'
    ]
  },
  resolve: {
    root: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'assets')],
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'assets'),
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader'
        ]
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('css!sass!postcss')
      },
      {
        test: /\.(png|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]+\.[0-9]+\.[0-9]+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]+\.[0-9]+\.[0-9]+)?$/,
        loader: 'file-loader'
      }
    ]
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ],
  devtool: 'eval',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'html', 'default.html'),
      inject: 'body',
      filename: './index.html'
    })
  ]
};

