/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { isProd, cssFolder } = require("../utils/env")

const config = {
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: isProd ? `${cssFolder}/[name].css` : "[name].[contenthash].css",
  chunkFilename: "[id].[contenthash].css"
}

module.exports.miniCssExtractPlugin = new MiniCssExtractPlugin(config)
