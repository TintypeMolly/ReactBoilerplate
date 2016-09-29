import path from "path";
import webpack from "webpack";

import baseConfig, {sourceDir, outputDir} from "../base";
import babelConfig from "../../babel/server";

const DEVELOPMENT = process.env.NODE_ENV === "development";

const globalConstants = {
  "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
  "process.env.BROWSER": false,
  __DEV__: DEVELOPMENT,
};

const serverConfig = {
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
  entry: path.join(sourceDir, "server.js"),
  output: {
    path: outputDir,
    filename: "server.js",
    chunkFilename: "server.[name].js",
    libraryTarget: "commonjs2",
  },
  target: "node",
  externals: [
    /^\.\/assets$/,
  ],
  plugins: [
    new webpack.DefinePlugin(globalConstants),
    new webpack.BannerPlugin("require(\"source-map-support\").install();", {raw: true, entryOnly: false}),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
  ],
  node: {
    __filename: false,
    __dirname: false,
  },
  devtool: "source-map",
};

export default serverConfig;
