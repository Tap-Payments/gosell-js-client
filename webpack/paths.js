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

	imgsPath: 'https://goselljslib.b-cdn.net/imgs/',
	fontsPath: 'https://goSellJSLib.b-cdn.net/fonts/',
	// serverPath: 'http://localhost:8000',
	// serverPath: 'http://192.168.8.164:8000',
	// serverPath: 'http://192.168.0.7:8000',
	serverPath: 'http://192.168.42.214:8000'
};

// GoSellGateway - page
// GoSellGateway - popup
// GoSellElements
// imgsPath: path.resolve(__dirname, "../", "src/assets/imgs/"),
