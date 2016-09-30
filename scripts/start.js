import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import nodemon from "nodemon";
import browserSync from "browser-sync";

import {clientConfig, serverConfig} from "../config/webpack";
import {DEV_SERVER_PORT} from "../config";
import {PORT} from "../src/config";
import clean from "./clean";
import {taskStart, taskEnd, catchPromiseReject} from "./util";
import {copyFavicon} from "./favicon";

const start = async() => {
  await clean();
  await copyFavicon();
  taskStart("start");

  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);
  let initialBuild = true;

  const handleError = (err, stats, reject) => {
    if (err) {
      reject(err);
    }
    const jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
      reject(jsonStats.errors);
    }
  };

  const clientBuild = new Promise((resolve, reject) => {
    clientCompiler.run((err, stats) => {
      handleError(err, stats, reject);
      resolve();
    });
  });

  const serverBuild = new Promise((resolve, reject) => {
    serverCompiler.watch({}, (err, stats) => {
      handleError(err, stats, reject);
      if (initialBuild) {
        initialBuild = false;
        resolve();
      } else {
        serverCompiler.run((err, stats) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            process.exit(1);
          }
          const jsonStats = stats.toJson();
          if (jsonStats.errors.length > 0) {
            for (const err of jsonStats.errors) {
              // eslint-disable-next-line no-console
              console.error(err);
            }
            process.exit(1);
          }
        });
      }
    });
  });

  await Promise.all([clientBuild, serverBuild]);
  taskEnd("start");

  // run browsersync
  const bsServer = browserSync.create();
  bsServer.init({
    port: DEV_SERVER_PORT,
    middleware: [
      webpackDevMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        stats: clientConfig.stats,
      }),
      webpackHotMiddleware(clientCompiler),
    ],
    proxy: `http://localhost:${PORT}`,
  });

  // run server
  const monitor = nodemon({
    script: path.resolve(__dirname, "../build/server.js"),
  });
  process.once("SIGINT", () => {
    monitor.once("exit", () => {
      process.exit();
    });
  });
};

if (require.main === module) {
  catchPromiseReject(start());
}
