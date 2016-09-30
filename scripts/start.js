import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import nodemon from "nodemon";
import browserSync from "browser-sync";

import {clientConfig, serverConfig} from "../config/webpack";
import {handleWebpackError} from "./util";
import {DEV_SERVER_PORT} from "../config";
import {PORT} from "../src/config";
import clean from "./clean";
import {taskStart, taskEnd} from "./util";
import {copyFavicons} from "./favicon";

const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);
let initialBuild = true;

clean();
copyFavicons();

taskStart("start");

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
      serverCompiler.run(handleWebpackError);
    }
  });
});

Promise.all([clientBuild, serverBuild]).then(() => {
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
});
