/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const { cssLoader, miniCssExtractLoader, postCssLoader } = require("./useLoaderRuleItems")

/** css **/
const cssRule = {
  test: /\.css$/,
  use: [miniCssExtractLoader, cssLoader, postCssLoader]
}

module.exports = {
  cssRule
}
