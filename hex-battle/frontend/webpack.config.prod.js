const path = require('path');

module.exports = {
  mode: 'production',

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
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
};
