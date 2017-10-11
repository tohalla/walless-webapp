/* eslint-disable import/no-commonjs */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      path.resolve(__dirname, 'src', 'index')
    ],
    authentication: path.resolve(__dirname, 'src', 'authentication'),
    vendor: [
      'material-design-icons/iconfont/material-icons.css',
      'normalize.css/normalize.css',
      'react-select/dist/react-select.css'
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      radium: path.join(__dirname, 'node_modules', 'radium')
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'assets/js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {loader: 'css-loader', options: {importLoaders: 1}},
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')()]
              }
            }
          ]
        })
      },
      {
        test: /\.(png|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2)?(\?v=[0-9]+\.[0-9]+\.[0-9]+)?$/,
        loader: 'url-loader',
        options: {
          limit: 50000,
          name: 'assets/fonts/[name].[ext]',
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'svg-react-loader'
      }
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
    }),
    new ExtractTextPlugin({
      filename: 'assets/css/[name].css',
      disable: false,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'html', 'default.html'),
      inject: 'body',
      chunks: ['app', 'vendor'],
      favicon: 'assets/images/favicon.ico',
      filename: './index.html'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'html', 'authentication.html'),
      inject: 'body',
      chunks: ['authentication'],
      favicon: 'assets/images/favicon.ico',
      filename: './authentication.html'
    })
  ]
};

