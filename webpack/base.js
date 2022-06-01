/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const path = require("path")
const entry = require("./entry")
const optimization = require("./optimization")
const plugins = require("./plugins")
const rules = require("./rules")
const { isProd, isDev, rootDir, jsFolder, version } = require("./utils/env")
const { arrayFilterEmpty } = require("./utils/helpers")

module.exports = {
  devtool: isProd ? "source-map" : "eval",
  context: __dirname,
  target: isDev ? "web" : ["web", "es5"],
  mode: isProd ? "production" : "development",
  entry,
  output: {
    path: path.join(rootDir, `v${version}`),
    publicPath: isDev ? undefined : "./",
    filename: isDev ? "[name].[fullhash].js" : `${jsFolder}/[name].js`,
    asyncChunks: true,
    clean: true
  },
  module: {
    rules: arrayFilterEmpty([rules.javascriptRule, rules.htmlRule, rules.imagesRule, rules.fontsRule, rules.cssRule])
  },
  plugins: arrayFilterEmpty([plugins.htmlWebpackPlugin, plugins.providePlugin, plugins.definePlugin, plugins.progressPlugin]),
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json"]
  },
  optimization
}
