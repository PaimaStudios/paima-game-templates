const path = require('path');

module.exports = {
  mode: 'development',
  watch: true,
  devServer: {
    static: {
      directory: path.join(__dirname, 'site'),
    },
    port: 9944,
  },
  devtool: 'inline-source-map',
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './site'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    unknownContextCritical: false,
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
};
