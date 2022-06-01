const path = require("path")
const PACKAGE = require("../package.json")

module.exports = {
  root: path.resolve(__dirname, "../"),

  entryPath: path.resolve(__dirname, "../", "src/index.js"),

  outputPath: path.resolve(__dirname, "../", "v" + PACKAGE.version),

  demoPath: path.resolve(__dirname, "../", "demo/index.js"),

  templatePath: path.resolve(__dirname, "../", "src/index.html"),

  imgsFolder: "imgs",
  fontsFolder: "fonts",
  cssFolder: "css",
  jsFolder: "js",

  imgsFolder: "imgs",
  fontsFolder: "fonts",
  cssFolder: "css",
  jsFolder: "js"
}
