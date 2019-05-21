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

	imgsPath: 'https://goselljslib.b-cdn.net/v1.3/imgs/',
	fontsPath: 'https://goSellJSLib.b-cdn.net/fonts/',
	cssPath: 'https://goSellJSLib.b-cdn.net/css/',
	// serverPath: 'http://localhost:8000',
  serverPath: 'http://35.195.64.244/api',
  framePath: 'http://goweb.tap.company/',
  // framePath: 'http://localhost:3000/',
};
