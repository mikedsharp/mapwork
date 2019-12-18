const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'none',
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
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
              hmr: true
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
