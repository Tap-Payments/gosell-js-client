/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const { DefinePlugin } = require("webpack")
const { isDev, isProd, mode } = require("../utils/env")

const config = {
  "process.env": {
    NODE_ENV: JSON.stringify(mode)
  },
  IS_PROD: isProd,
  IS_DEV: isDev,
  IS_DEV_SERVER: isDev
}

module.exports.definePlugin = new DefinePlugin(config)
