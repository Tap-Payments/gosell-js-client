const webpack = require("webpack");
const commonPaths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
	entry: commonPaths.entryPath,
	module: {
			rules: [
					{
							test: /\.(js|jsx)$/,
							use: "babel-loader",
							exclude: /node_modules/
					},
					{
							test: /\.css$/,
							use: ["style-loader", "css-loader"]
					},
					{
							test: /\.(png|jpg|gif|svg|otf|ico)$/,
							use: [
								{
									loader: 'file-loader',
									options: {}
								}
							]
					},
					{
						test: /\.(ttf|otf|eot|woff|woff2)$/,
						use: {
							loader: "file-loader",
							options: {
								name: "fonts/[name].[ext]",
							},
						},
					}
			]
	},
	// resolve: {
	// 	extensions: ["*", ".js", ".jsx"],
	// 	alias: {
	// 		react: "preact-compat",
	// 		"react-dom": "preact-compat"
	// 	}
	// },
	resolve: {
			extensions: [".js", ".jsx"]
	},
	plugins: [
		new webpack.ProgressPlugin(),
		new HtmlWebpackPlugin({
			template: commonPaths.templatePath,
			favicon: commonPaths.imgPath + '/tapLogo.png'
		}),
		new UglifyJSPlugin({
			cache: true,
			parallel: true,
			uglifyOptions: {
				compress: true,
				ecma: 6,
				mangle: true
			},
			sourceMap: true
		}),
		new CompressionPlugin()
	]
};
