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
  jsFolder: "js",

  imgsPath: "https://goselljslib.b-cdn.net/v1.3/imgs/",
  fontsPath: "https://goSellJSLib.b-cdn.net/fonts/",
  cssPath: "https://goSellJSLib.b-cdn.net/css/",

  // ************************ staging URL *************************
  // serverPath: "https://checkout.staging.tap.company/api",
  // framePath: "https://checkout.staging.tap.company/"

  // ************************ sandbox URL *************************
  serverPath: "https://sandbox-checkout.payments.tap.company/api",
  framePath: "https://sandbox-checkout.payments.tap.company/"

  // ************************ production URL *************************
  // serverPath: "https://checkout.payments.tap.company/api",
  // framePath: "https://checkout.payments.tap.company/",

  // ************************ localhost URL *************************
  // serverPath: "http://localhost:8000",
  // framePath: "http://localhost:3000/",
}
