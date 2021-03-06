const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: './client.js',
    path: path.resolve(__dirname, 'build'),
  },
  mode: 'development',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: ['transform-object-rest-spread', 'transform-class-properties'],
          },
        },
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'svg-url-loader',
          options: { noquotes: true },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({ PLATFORM: JSON.stringify('web') }),
  ],
  devServer: {
    proxy: {
      '/api': 'http://localhost:9000',
    },
  },
};
