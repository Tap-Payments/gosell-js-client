/**
 * Created by: Ahmed Elsharkawy (a.elsharkawy@tap.company)
 */
const plugins = require('./plugins');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  optimization: {
    minimize: true,
    minimizer: [plugins.terserPlugin],
  },
  plugins: [plugins.cleanWebpackPlugin, plugins.miniCssExtractPlugin, new CompressionPlugin()],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
if (Boolean(process.env.ANALYZER)) {
  config.plugins = [new BundleAnalyzerPlugin(), ...config.plugins];
}

module.exports = config;
