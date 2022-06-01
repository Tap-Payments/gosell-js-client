/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */

const { merge } = require("webpack-merge")
const baseConfig = require("./webpack/base")
const devConfig = require("./webpack/dev")
const prodConfig = require("./webpack/prod")
const { isProd } = require("./webpack/utils/env")

module.exports = isProd ? merge(baseConfig, prodConfig) : merge(baseConfig, devConfig)
