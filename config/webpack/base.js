import path from "path";

const DEVELOPMENT = process.env.NODE_ENV === "development";
const PRODUCTION = process.env.NODE_ENV === "production";
const VERBOSE = process.argv.includes("--verbose");
if (DEVELOPMENT === PRODUCTION) {
  // eslint-disable-next-line no-console
  console.error("process.env.NODE_ENV is not properly set. Set it \"development\" or \"production\"");
  process.exit(1);
}

const sourceDir = path.resolve(__dirname, "../../src");
const outputDir = path.resolve(__dirname, "../../build");

const baseConfig = {
  bail: true,
  context: sourceDir,
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          "isomorphic-style-loader",
          `css-loader?${JSON.stringify({
            sourceMap: DEVELOPMENT,
            minimize: PRODUCTION,
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
  debug: DEVELOPMENT,
  cache: DEVELOPMENT,

  stats: {
    colors: true,
    timings: true,
    reasons: DEVELOPMENT,
    hash: VERBOSE,
    version: VERBOSE,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },
};

export default baseConfig;
export {sourceDir, outputDir};
