/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const { isProd } = require("../utils/env")
const { arrayFilterEmpty } = require("../utils/helpers")

module.exports = () => {
  const plugins = arrayFilterEmpty(["autoprefixer", isProd ? "cssnano" : null])
  return {
    plugins
  }
}
