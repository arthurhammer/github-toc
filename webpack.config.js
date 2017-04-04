const path = require('path');

const config = {

  entry: './src/github-toc.js',
  output: {
    filename: 'github-toc.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [{
      test: /\.html$/,
      loader: 'html-loader',
      options: { minimize: true },
    }]
  }

};

module.exports = config;
