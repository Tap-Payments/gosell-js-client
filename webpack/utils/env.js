/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const { join } = require("path")

const mode = process.env.NODE_ENV ?? "production"

module.exports = {
  mode,
  isProd: mode === "production",
  isDev: mode === "development",
  rootDir: join(__dirname, "../../"),
  webpackDir: join(__dirname, "../"),
  defaultPort: 3001,
  imgsFolder: "imgs",
  fontsFolder: "fonts",
  cssFolder: "css",
  jsFolder: "js",
  version: require(join(join(__dirname, "../../"), "package.json")).version
}
