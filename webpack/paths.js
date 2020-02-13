const path = require("path");

module.exports = {
  root: path.resolve(__dirname, "../"),

  entryPath: path.resolve(__dirname, "../", "src/index.js"),

  outputPath: path.resolve(__dirname, "../", "build"),

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
  // serverPath: "http://localhost:8000",
  // framePath: "http://localhost:3000/"
  // serverPath: "https://jslib.payments.gosell.io/api",
  // framePath: "https://jslib.payments.gosell.io/",
  serverPath: "https://jslib-staging.payments.tap.company/api",
  framePath: "https://jslib-staging.payments.tap.company/"
};
