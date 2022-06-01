/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const config = {
  cleanOnceBeforeBuildPatterns: ["**/*", `../../build`, "../../build-*", "../../dist", "!profile.json", "!tsconfig.tsbuildinfo"]
}

module.exports.cleanWebpackPlugin = new CleanWebpackPlugin(config)
