const path = require('path');
const DefinePlugin = require('webpack').DefinePlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// Get environment variable
const target = process.env.TARGET || '';

const config = {

  entry: './src/index.js',
  output: {
    filename: (target === 'userscript') ? 'github-toc.user.js' : 'github-toc.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [{
      test: /\.html$/,
      loader: 'html-loader',
      options: { minimize: true },
    }, {
      test: /\.css$/,
      loader: 'raw-loader'
    }
  ]
  },

  plugins: [
    // Inject environment variable as a global into code
    new DefinePlugin({
      TARGET: JSON.stringify(target),
    }),
    // Remove dead code from target branching
    new UglifyJSPlugin({
      beautify: true,
      mangle: false,
    })
  ]

};

module.exports = config;
