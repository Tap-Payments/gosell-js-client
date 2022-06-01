/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const TerserPlugin = require("terser-webpack-plugin")

module.exports.terserPlugin = new TerserPlugin({
  test: /\.js(\?.*)?$/i,
  parallel: true,
  terserOptions: {
    compress: {
      pure_funcs: ["console.log", "console.info", "console.debug", "console.warn"]
    }
  }
})
