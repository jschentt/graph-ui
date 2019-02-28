const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pathConfig = require('./pathConfig')

module.exports = {
  mode: 'production',
  entry: {
    vendors: [
      'react',
      'react-dom',
      'mobx',
      'mobx-react',
      'react-router-dom',
      'axios',
    ],
  },
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    path: pathConfig.appBuild,
    library: '[name]',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin([pathConfig.appBuild], {
      root: pathConfig.appPath,
    }),
    new HtmlWebpackPlugin({ template: pathConfig.appHtml }),
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../build/manifest.json'),
      // This must match the output.library option above
      name: '[name]',
      context: pathConfig.appPath,
    }),
  ],
}
