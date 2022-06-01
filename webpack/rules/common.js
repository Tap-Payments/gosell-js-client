/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const { babelLoader } = require("./useLoaderRuleItems")

/**
 * @see https://webpack.js.org/loaders/babel-loader
 */
module.exports.javascriptRule = {
  test: /\.(js|jsx)$/,
  use: [babelLoader],
  exclude: /node_modules/
}

/**
 * @see https://webpack.js.org/loaders/html-loader
 */
module.exports.htmlRule = {
  test: /\.(html)$/,
  use: {
    loader: "html-loader"
  }
}
/**
 * @see https://webpack.js.org/guides/asset-modules/
 */
module.exports.imagesRule = {
  test: /\.(png|svg|jpg|jpeg|gif)$/i,
  type: "asset/inline"
}
/**
 * @see https://webpack.js.org/guides/asset-modules/
 */
module.exports.fontsRule = {
  test: /\.(woff|woff2|eot|ttf|otf)$/i,
  type: "asset/resource"
}
