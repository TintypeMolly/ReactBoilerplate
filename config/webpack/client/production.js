import path from "path";
import webpack from "webpack";

import clientBaseConfig from "./base";
import {sourceDir} from "../base";

const clientConfig = {
  ...clientBaseConfig,
  entry: [
    path.join(sourceDir, "client.js"),
  ],

  plugins: [
    ...clientBaseConfig.plugins,
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
};

export default clientConfig;
