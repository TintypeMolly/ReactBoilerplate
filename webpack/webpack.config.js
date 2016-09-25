import path from "path";
import webpack from "webpack";
import AssetsPlugin from "assets-webpack-plugin";
import deepcopy from "deepcopy";

import babelrc from "./babelrc";

const isProduction = process.argv.includes("--production");
const isVerbose = process.argv.includes("--verbose");

process.env.NODE_ENV = isProduction ? "production" : "development";

const sourceDir = path.resolve(__dirname, "../src");
const outputDir = path.resolve(__dirname, "../build");

const GLOBALS = {
  "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
  __DEV__: !isProduction,
};

const baseConfig = {
  bail: true,
  context: sourceDir,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [sourceDir],
        query: {
          cacheDirectory: !isProduction,
          babelrc: false,
          ...babelrc(isProduction),
        }
      },
      {
        test: /\.css$/,
        loaders: [
          "isomorphic-style-loader",
          `css-loader?${JSON.stringify({
            sourceMap: !isProduction,
            minimize: isProduction,
            localIdentName: "[name].[hash].[ext]",
          })}`,
        ],
      },
      {test: /\.json/, loader: "json-loader"},
      {test: /\.txt/, loader: "raw-loader"},
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: "url-loader",
        query: {
          name: "[name].[hash].[ext]",
          limit: 10000,
        },
      },
      {
        test: /\.(eot|ttf|wav|mp3)/,
        loader: "file-loader",
        query: {
          name: "[name].[hash].[ext]",
        },
      },
    ],
  },
  debug: !isProduction,
  cache: !isProduction,

  stats: {
    colors: true,
    timings: true,
    reasons: !isProduction,
    hash: isVerbose,
    version: isVerbose,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  }
};

const clientConfig = Object.assign({}, deepcopy(baseConfig), {
  entry: [
    ...isProduction ? [] : [
      "react-hot-loader/patch",
      "webpack-hot-middleware/client",
    ],
    path.join(sourceDir, "client.js"),
  ],
  output: {
    path: path.join(outputDir, "public"),
    publicPath: "/public/",
    filename: "client.[hash].js",
    chunkFilename: "client.[hash].js",
  },
  target: "web",
  plugins: [
    new webpack.DefinePlugin(Object.assign({}, GLOBALS, {"process.env.BROWSER": true})),
    new AssetsPlugin({
      path: "build/",
      filename: "assets.js",
      processOutput: x => `module.exports = ${JSON.stringify(x)};`,
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),

    ...isProduction ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ] : [
      new webpack.HotModuleReplacementPlugin(),
    ],
  ],
  devtool: isProduction ? "source-map" : false,
});

const serverConfig = Object.assign({}, deepcopy(baseConfig), {
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
    new webpack.DefinePlugin(Object.assign({}, GLOBALS, {"process.env.BROWSER": false})),
    new webpack.BannerPlugin("require(\"source-map-support\").install();", {raw: true, entryOnly: false}),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
  ],
  node: {
    __filename: false,
    __dirname: false,
  },
  devtool: "source-map",
});

// delete server side react-transform plugins since they cause error in node environment
if (!isProduction) {
  serverConfig.module.loaders[0].query.plugins = ["transform-runtime"];
  clientConfig.module.loaders[0].query.plugins.unshift("react-hot-loader/babel");
  serverConfig.module.loaders[0].query.plugins.unshift("react-hot-loader/babel");
  console.log(clientConfig.module.loaders[0].query.plugins);
  console.log(serverConfig.module.loaders[0].query.plugins);
}

export {
  clientConfig,
  serverConfig
};
