import webpack from "webpack";

import clean from "./clean";
import {clientConfig, serverConfig} from "../config/webpack";
import {taskStart, taskEnd, catchPromiseReject} from "./util";
import {copyFavicon} from "./favicon";

const build = async() => {
  await clean();
  await copyFavicon();
  taskStart("build");
  // eslint-disable-next-line no-console
  console.log(`Using ${process.env.NODE_ENV} config...`);

  const configs = [clientConfig, serverConfig];
  const bundler = webpack(configs);
  await new Promise((resolve, reject) => {
    bundler.run((err, stats) => {
      if (err) {
        reject(err);
      }
      const jsonStats = stats.toJson();
      if (jsonStats.errors.length > 0) {
        reject(jsonStats.errors);
      }
      resolve();
    });
  });
  taskEnd("build");
};

if (require.main === module) {
  catchPromiseReject(build());
}

export default build;
