/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const pluginCleanWebpack = require("./pluginCleanWebpack")
const pluginDefine = require("./pluginDefine")
const pluginHtml = require("./pluginHtml")
const pluginMiniCssExtract = require("./pluginMiniCssExtract")
const pluginProvide = require("./pluginProvide")
const progressPlugin = require("./progressPlugin")
const terserPlugin = require("./terserPlugin")

module.exports = {
  ...pluginCleanWebpack,
  ...pluginDefine,
  ...pluginHtml,
  ...pluginMiniCssExtract,
  ...pluginProvide,
  ...progressPlugin,
  ...terserPlugin
}
