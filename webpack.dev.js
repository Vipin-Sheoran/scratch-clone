const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge([
  common,
  {
    mode: "development",
    devServer: {
      contentBase: path.join(__dirname, "public"),
      compress: true,
      port: 3000,
      historyApiFallback: true,
      hot: true,
      liveReload: true,
      watchContentBase: true,
    },
  },
]);
