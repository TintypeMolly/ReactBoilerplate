import path from "path";
import webpack from "webpack";

import {sourceDir} from "../base";
import clientBaseConfig from "./base";

const clientConfig = {
  ...clientBaseConfig,
  entry: [
    "react-hot-loader/patch",
    "webpack-hot-middleware/client",
    path.join(sourceDir, "client.js"),
  ],
  plugins: [
    ...clientBaseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: "source-map",
};

export default clientConfig;
