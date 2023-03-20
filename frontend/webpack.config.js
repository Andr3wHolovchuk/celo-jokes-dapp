const path = require("path");
const webpack = require("webpack");
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  entry: {
    main: path.resolve(process.cwd(), "src", "main.js"),
    profile: path.resolve(process.cwd(), "src", "profile.js"),
    category: path.resolve(process.cwd(), "src", "category.js")
  },
  output: {
    path: path.resolve(process.cwd(), "docs"),
    publicPath: ""
  },
  node: {
    fs: "empty",
    net: "empty"
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300, // After seeing an edit, wait .3 seconds to recompile
    poll: 500 // Check for edits every 5 seconds
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(process.cwd(), "public", "index.html"),
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      filename: 'profile.html',
      template: path.resolve(process.cwd(), "public", "profile.html"),
      chunks: ['profile']
    }),
    new HtmlWebpackPlugin({
      filename: 'category.html',
      template: path.resolve(process.cwd(), "public", "category.html"),
      chunks: ['category']
    }),
    new CopyPlugin({
      patterns: [
        { from: "public/assets" }
      ],
    })
  ]
}
