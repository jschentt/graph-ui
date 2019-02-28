const path = require('path')
const root = path.resolve(__dirname, '../')
const resolveApp = relativePath => path.resolve(root, relativePath);

module.exports = {
  appPath: root,
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appBuildHtml: resolveApp('build/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appSrc: resolveApp('src'),
  appApi: resolveApp('src/api'),
  appComponent: resolveApp('src/component'),
  appImage: resolveApp('src/image'),
  appPage: resolveApp('src/page'),
  appUtil: resolveApp('src/util'),
  appNodeModules: resolveApp('node_modules'),
}