const webpack = require("webpack")
const path = require("path")
const HtmlWebPackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/main.js",
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new webpack.EnvironmentPlugin([
      "ASSET_SERVER_URI",
      "CONTENT_SERVER_URI",
      "GAME_SERVER_URI",
      "STATIC_SERVER_URI"
    ])
  ],
  devServer: {
    disableHostCheck: true,
    host: "0.0.0.0"
  }
}
