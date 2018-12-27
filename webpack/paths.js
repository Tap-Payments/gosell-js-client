const path = require("path");

module.exports = {

	root: path.resolve(__dirname, "../"),

	// GoSellGateway - page
	// pageRoot: path.resolve(__dirname, "../goSellPage"),
	// pageDemoPath: path.resolve(__dirname, "../goSellPage", "demo/src/index.js"),

	// GoSellGateway - popup
	// popupRoot: path.resolve(__dirname, "../goSellLightBox"),
	// popupOutputPath: path.resolve(__dirname, "../goSellLightBox", "build"),
	// popupDemoPath: path.resolve(__dirname, "../goSellLightBox", "demo/src/index.js"),

	// GoSellElements
	// elementsRoot: path.resolve(__dirname, "../goSellElements"),
	// elementsOutputPath: path.resolve(__dirname, "../goSellElements", "build"),
	// elementsDemoPath: path.resolve(__dirname, "../goSellElements", "demo/src/index.js"),

	entryPath: path.resolve(__dirname, "../", "src/index.js"),

	outputPath: path.resolve(__dirname, "../", "build"),

	// demoPath: path.resolve(__dirname, "../", "demo/src/index.js"),

	templatePath: path.resolve(__dirname, "../", "src/index.html"),

	imgPath: path.resolve(__dirname, "../", "src/assets/imgs/"),
};

// GoSellGateway - page
// GoSellGateway - popup
// GoSellElements
