const BASEURL = 'http://localhost:3000'
console.log('后端地址: %s', process.env.BASEURL || BASEURL)

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const _ = require('lodash')
const pathConfig = require('./pathConfig')
const cssVar = require('../src/util/cssVar')
const modifyVars = _.mapKeys(cssVar, (value, key) => `@${key}`)

module.exports = {
  mode: 'development',
  entry: {
    app: pathConfig.appIndexJs,
  },
  output: {
    publicPath: '/',
    path: path.resolve(pathConfig.appBuild),
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    proxy: {
      '/api': {
        target: process.env.BASEURL || BASEURL,
        changeOrigin: true,
        secure: true,
      },
    },
    host: '127.0.0.1',
    contentBase: pathConfig.appBuild,
    hot: true,
    clientLogLevel: 'none',
    historyApiFallback: true,
  },
  plugins: [
    new CopyWebpackPlugin([pathConfig.appPublic]),
    new HtmlWebpackPlugin({ template: pathConfig.appHtml }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.js'],
    modules: [pathConfig.appSrc, pathConfig.appNodeModules],
    symlinks: false,
    alias: {
      src: pathConfig.appSrc,
      api: pathConfig.appApi,
      component: pathConfig.appComponent,
      image: pathConfig.appImage,
      page: pathConfig.appPage,
      util: pathConfig.appUtil,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  helpers: false,
                  regenerator: true,
                  useESModules: true,
                },
              ],
              '@babel/plugin-syntax-dynamic-import',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              ['import', { libraryName: 'antd', style: true }],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              alias: { image: path.resolve(__dirname, '../src/image') },
            },
          },
          {
            loader: 'postcss-loader',
            options: { plugins: [require('autoprefixer')] },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              alias: { image: path.resolve(__dirname, '../src/image') },
            },
          },
          {
            loader: 'postcss-loader',
            options: { plugins: [require('autoprefixer')] },
          },
          {
            loader: 'less-loader',
            options: { modifyVars, javascriptEnabled: true },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|ttf|woff)$/,
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
}
