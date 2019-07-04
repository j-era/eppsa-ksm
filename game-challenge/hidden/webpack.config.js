const webpack = require("webpack")
const path = require("path")
const HtmlWebPackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/main.js",
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 1000
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new webpack.EnvironmentPlugin([
      "ASSET_SERVER_URI",
      "CONTENT_SERVER_URI",
      "STATIC_SERVER_URI"
    ])
  ],
  devServer: {
    disableHostCheck: true,
    host: "0.0.0.0"
  }
}
