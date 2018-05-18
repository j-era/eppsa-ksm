const webpack = require("webpack")
const path = require("path")
const HtmlWebPackPlugin = require("html-webpack-plugin")
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  //entry: "./src/main.js",
  entry: ["./src/main.js"],
  module:{
    rules:[
        {
            test:/\.css$/,
            use:['style-loader','css-loader']
        },
        {
          test: /\.(png|jp(e*)g|svg)$/,  
          use: [{
              loader: 'url-loader',
              options: { 
                  limit: 8000, // Convert images < 8kb to base64 strings
                  name: 'images/[hash]-[name].[ext]'
              } 
          }]
        }
   ]
  },
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
    ]),
    new CopyWebpackPlugin([
      {from:'src/img',to:'images'},
      {from:'src/models',to:'models'} 
    ])
  ],
  devServer: {
    disableHostCheck: true,
    host: "0.0.0.0"
  }
}
