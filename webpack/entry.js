/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const { join } = require("path")
const { rootDir, isProd } = require("./utils/env")

module.exports = {
  gosell: [join(rootDir, isProd ? "src/index.js" : `demo/index.js`), join(__dirname, "./utils/cleanConsoleOnHMR.js")]
}
