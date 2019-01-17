const commonPaths = require("./paths");

module.exports = {
	mode: "development",
	output: {
		filename: '[name].js',
		path:  commonPaths.outputPath,
		chunkFilename: '[id].[chunkhash].js',
		library: 'goSell',
		globalObject: 'this',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader"
				]
      }
		]
	},
	devServer: {
		historyApiFallback: true,
		contentBase: commonPaths.templatePath,
		port: 3000,
		open: true
	}
};