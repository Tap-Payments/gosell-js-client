const path = require("path");

console.log('__dirname', __dirname);

module.exports = {

	root: path.resolve(__dirname, "../"),

	entryPath: path.resolve(__dirname, "../", "src/index.js"),

	outputPath: path.resolve(__dirname, "../", "build"),

	demoPath: path.resolve(__dirname, "../", "demo/index.js"),

	templatePath: path.resolve(__dirname, "../", "src/index.html"),

	imgsPath: path.resolve(__dirname, "../", "src/assets/imgs/"),

	imgsFolder: "imgs",
	fontsFolder: "fonts",
	cssFolder: "css",
	jsFolder: "js"

};

// GoSellGateway - page
// GoSellGateway - popup
// GoSellElements
