const commonPaths = require("./paths");

module.exports = {
	mode: "development",
	output: {
		filename: "gosell.js",
		path: commonPaths.outputPath,
		chunkFilename: "[name].js",
		library: 'goSell',
		globalObject: 'this',
		libraryTarget: 'umd'
	},
	devServer: {
		historyApiFallback: true,
		contentBase: commonPaths.templatePath,
		port: 3000,
		open: true
	}
};
