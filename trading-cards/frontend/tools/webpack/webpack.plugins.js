const webpack = require("webpack");
const { inDev } = require("./webpack.helpers");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = [
  new NodePolyfillPlugin(),
  new webpack.ProvidePlugin({
    process: "process/browser",
  }),
  new webpack.DefinePlugin({
    "process.env": JSON.stringify(
      Object.fromEntries(
        [
          "CHAIN_URI",
          "CHAIN_EXPLORER_URI",
          "CHAIN_NAME",
          "CHAIN_ID",
          "CHAIN_CURRENCY_NAME",
          "CHAIN_CURRENCY_SYMBOL",
          "CHAIN_CURRENCY_DECIMALS",
          "BLOCK_TIME",
          "CONTRACT_ADDRESS",
          "START_BLOCKHEIGHT",
          "BACKEND_URI",
          "WEBSERVER_PORT",
          "SERVER_ONLY_MODE",
          "NATIVE_PROXY",
          "NFT",
          "CARD_TRADE_NATIVE_PROXY",
          "CARD_TRADE_NFT",
          "GENERIC_PAYMENT",
          "GENERIC_PAYMENT_PROXY",
          "CARD_PACK_NFT_PRICE_DEFAULT_DENOMINATION",
        ].map((key) => [key, process.env[key]]),
      ),
    ),
  }),
  new ForkTsCheckerWebpackPlugin(),
  inDev() && new webpack.HotModuleReplacementPlugin(),
  inDev() && new ReactRefreshWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: "src/index.html",
    favicon: "assets/images/logo.webp",
    inject: true,
  }),
  new MiniCssExtractPlugin({
    filename: "[name].[chunkhash].css",
    chunkFilename: "[name].[chunkhash].chunk.css",
  }),
].filter(Boolean);
