/* eslint-disable import/no-commonjs */
// const production = require('./webpack.production.config');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const development = require('./webpack-development.config');
const production = require('./webpack-production.config');

module.exports = merge(
  {
    entry: {
      app: ['babel-polyfill', path.resolve(__dirname, 'src', 'index')],
      authentication: path.resolve(__dirname, 'src', 'authentication')
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'assets'),
        'node_modules'
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: 'assets/js/[name].[hash].js'
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
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
                  importLoaders: 1
                }
              },
              {
                loader: 'postcss-loader',
                options: {plugins: [require('autoprefixer')()]}
              }
            ]
          })
        },
        {
          test: /\.(svg|gif|png|jpe?g)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/images/[name].[hash:8].[ext]'
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true
              }
            }
          ]
        },
        {
          test: /\.(ttf|eot|woff|woff2)?(\?v=[0-9]+\.[0-9]+\.[0-9]+)?$/,
          loader: 'url-loader',
          options: {
            limit: 50000,
            name: 'assets/fonts/[name].[hash:8].[ext]',
            mimetype: 'application/font-woff'
          }
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'assets/css/[name].[contenthash:8].css',
        disable: false,
        allChunks: true
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'html', 'default.html'),
        inject: 'body',
        chunks: ['app'],
        favicon: 'assets/images/favicon.ico',
        filename: './index.html',
        minify: {
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true
        }
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'html', 'authentication.html'),
        inject: 'body',
        chunks: ['authentication'],
        favicon: 'assets/images/favicon.ico',
        filename: './authentication.html',
        minify: {
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true
        }
      })
    ]
  },
  process.env.NODE_ENV === 'production' ? production : development
);

