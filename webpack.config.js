const path = require("path");
const dotenv = require("dotenv");
const webpack = require("webpack");
require("@babel/polyfill");

module.exports = () => {
  const env = dotenv.config().parsed;
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});
  console.log(envKeys);
  return {
    entry: ["@babel/polyfill", "./src/client/Index.js"],
    output: {
      path: path.resolve(__dirname, "public"),
      publicPath: "/",
      filename: "bundle.js",
    },
    devServer: {
      contentBase: "./",
      publicPath: "/dist/",
      historyApiFallback: true,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [new webpack.DefinePlugin(envKeys)],
    resolve: {
      extensions: [".js", ".jsx", ".json", ".wasm", ".mjs", "*"],
    },
  };
};
