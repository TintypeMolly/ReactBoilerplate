import path from "path";
import webpack from "webpack";
import AssetsPlugin from "assets-webpack-plugin";

import baseConfig, {sourceDir, outputDir} from "../base";
import babelConfig from "../../babel/client";

const DEVELOPMENT = process.env.NODE_ENV === "development";

const globalConstants = {
  "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
  "process.env.BROWSER": true,
  __DEV__: DEVELOPMENT,
};

const clientBaseConfig = {
  ...baseConfig,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [sourceDir],
        query: {
          cacheDirectory: DEVELOPMENT,
          babelrc: false,
          ...babelConfig,
        },
      },
      ...baseConfig.module.loaders,
    ],
  },
  output: {
    path: path.join(outputDir, "public"),
    publicPath: "/",
    filename: "client.[hash].js",
    chunkFilename: "client.[hash].js",
  },
  target: "web",
  plugins: [
    new webpack.DefinePlugin(globalConstants),
    new AssetsPlugin({
      path: outputDir,
      filename: "assets.js",
      processOutput: x => `module.exports = ${JSON.stringify(x)};`,
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
  ],
};

export default clientBaseConfig;
