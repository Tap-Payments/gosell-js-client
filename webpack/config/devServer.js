/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const { defaultPort } = require("../utils/env")

module.exports.devServerConfig = {
  client: {
    overlay: false
  },
  headers: { "Access-Control-Allow-Origin": "*" },
  historyApiFallback: true,
  hot: true,
  open: true,
  port: defaultPort,
  static: {
    publicPath: "/"
  }
}
