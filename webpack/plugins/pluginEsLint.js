/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const { join } = require("path")

const ESLintPlugin = require("eslint-webpack-plugin")

const { rootDir } = require("../utils/env")

const config = {
  context: join(rootDir, "/src"),
  extensions: ["js", "jsx", "ts", "tsx"]
}

module.exports.esLintPlugin = new ESLintPlugin(config)
