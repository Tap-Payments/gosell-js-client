const webpack = require("webpack");
const commonPaths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    gosell: commonPaths.entryPath,
    // "gosell-demo": commonPaths.demoPath,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg|otf|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: commonPaths.imgsFolder + "/[name].[ext]",
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              name: commonPaths.imgsFolder + "/[name].[ext]",
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
      {
        test: /\.(ttf|otf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: commonPaths.fontsFolder + "/[name].[ext]",
          },
        },
      },
    ],
  },
  // resolve: {
  // 	extensions: ["*", ".js", ".jsx"],
  // 	alias: {
  // 		react: "preact-compat",
  // 		"react-dom": "preact-compat"
  // 	}
  // },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: commonPaths.templatePath,
      favicon: "./webpack/tap-favicon.ico",
    }),
  ],
};
