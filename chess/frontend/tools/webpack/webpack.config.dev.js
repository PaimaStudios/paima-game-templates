const dotenv = require('dotenv')
dotenv.config({ path: `./../../.env.${process.env.NETWORK ?? "localhost"}` });

module.exports = {
  mode: "development",
  entry: ["./src/main.tsx"],
  module: {
    rules: require("./webpack.rules"),
  },
  output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
  },
  plugins: require("./webpack.plugins"),
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify"),
      "url": require.resolve("url"),
      "zlib": require.resolve("browserify-zlib"),
      "assert": require.resolve("assert/")
    },
    alias: require("./webpack.aliases"),
  },
  stats: "errors-warnings",
  devtool: "eval-source-map",
  devServer: {
    open: true,
    historyApiFallback: true,
    client: {
      overlay: { errors: true, warnings: false },
    },
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  performance: {
    hints: false,
  },
};
