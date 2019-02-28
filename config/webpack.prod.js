const path = require('path')
const webpack = require('webpack')
const _ = require('lodash')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const pathConfig = require('./pathConfig')
const cssVar = require('../src/util/cssVar')
const modifyVars = _.mapKeys(cssVar, (value, key) => `@${key}`)

module.exports = {
  mode: 'none',
  entry: {
    app: pathConfig.appIndexJs,
  },
  output: {
    path: pathConfig.appBuild,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new CopyWebpackPlugin([pathConfig.appPublic]),
    new HtmlWebpackPlugin({ template: pathConfig.appBuildHtml }),
    new webpack.DllReferencePlugin({
      context: path.resolve(pathConfig.appPath),
      manifest: require('../build/manifest.json'),
    }),
    new ParallelUglifyPlugin({
      uglifyJS: {},
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[chunkhash:8].css',
      chunkFilename: 'static/css/[name].[chunkhash:8].chunk.css',
    }),
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
                  useESModules: true
                },
              ],
              '@babel/plugin-syntax-dynamic-import',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              ['import', { libraryName: 'antd', style: true }],
              'lodash',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
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
          MiniCssExtractPlugin.loader,
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
