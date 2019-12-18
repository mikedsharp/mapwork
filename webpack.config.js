const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    hot: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      ignoreOrder: false
    }),
    new CopyPlugin([
      { from: 'Tilesets', to: 'Tilesets' },
      { from: 'Images', to: 'Images' }
    ]),
    new HtmlWebpackPlugin({ template: './index.html' })
  ],
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: '$'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader'
        ]
      },
      {
        test: /(\.(png|jpe?g|gif)$|^((?!font).)*\.svg$)/,
        loaders: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href']
            }
          }
        ]
      }
    ]
  }
};
