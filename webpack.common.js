// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // mode: "development",
  entry: "./src/main.js",
  output: {
    filename: "battleship.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  // devtool: "eval-source-map",
  // devServer: {
  //   watchFiles: ["./src/template.html"],
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
