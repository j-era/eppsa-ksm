const webpack = require("webpack")
const HtmlWebPackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: ["babel-polyfill", "./src/index.js"],
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        oneOf: [
          {
            test: /\.svg$/,
            use: "svg-react-loader"
          },
          {
            test: /\.(js|jsx|mjs)$/,
            include: ["./src", "./lib"],
            loader: require.resolve("babel-loader"),
            options: {
              cacheDirectory: true,
            },
          },
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new webpack.EnvironmentPlugin([
      "FONT_URI"
    ])
  ],
  devServer: {
    disableHostCheck: true,
    host: "0.0.0.0"
  }
}
