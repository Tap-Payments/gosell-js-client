/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const { join } = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { rootDir, webpackDir } = require("../utils/env")

const config = {
  filename: "index.html",
  inject: true,
  template: join(rootDir, "./src/index.html"),
  favicon: join(webpackDir, "tap-favicon.ico")
}

module.exports.htmlWebpackPlugin = new HtmlWebpackPlugin(config)
