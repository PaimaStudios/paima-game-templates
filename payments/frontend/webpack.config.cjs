const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
require('dotenv').config({ path: `./../../.env.${process.env.NETWORK ?? "local"}` });
const webpack = require('webpack');

if (!process.env.CHAIN_URI || !process.env.BACKEND_URI || !process.env.CHAIN_ID)
  throw new Error('Please ensure you have filled out your .env file');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      ['mina-signer']: false,
      ['fs/promises']: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify'),
      url: require.resolve('url/'),
      zlib: require.resolve('browserify-zlib'),
      assert: require.resolve('assert/'),
      vm: require.resolve("vm-browserify")
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.m?js/,
        type: 'javascript/auto',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      { test: /\.json$/, type: 'json' },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),

    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
      'process.browser': true,
    }),
    // new webpack.ProvidePlugin({
    //   Buffer: ['buffer', 'Buffer'],
    // }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
  },
  
};
