/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const { devServerConfig } = require("./config")

module.exports = {
  plugins: [new ReactRefreshWebpackPlugin()],
  devServer: devServerConfig
}
