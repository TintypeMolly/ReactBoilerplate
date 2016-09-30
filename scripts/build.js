import webpack from "webpack";

import clean from "./clean";
import {clientConfig, serverConfig} from "../config/webpack";
import {taskStart, taskEnd, handleWebpackError} from "./util";
import {copyFavicons} from "./favicon";

const build = () => {
  clean();
  copyFavicons();
  taskStart("build");
  // eslint-disable-next-line no-console
  console.log(`Using ${process.env.NODE_ENV} config...`);

  const configs = [clientConfig, serverConfig];
  const bundler = webpack(configs);
  bundler.run((err, stats) => {
    handleWebpackError(err, stats);
    taskEnd("build");
  });
};

if (require.main === module) {
  build();
}

export default build;
