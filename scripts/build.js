/* eslint-disable no-console */
import path from "path";
import webpack from "webpack";
import browserSync from "browser-sync";
import nodemon from "nodemon";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import clean from "./clean";
import {clientConfig, serverConfig} from "../webpack/webpack.config";
import {taskStart, taskEnd} from "./util";
import {PORT, DEV_SERVER_PORT} from "../src/config.js";

const build = isProduction => {
  clean();
  taskStart("build");
  console.log(`Using ${isProduction ? "\"production\"" : "\"development\""} config...`);

  const handleError = (err, stats) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    const jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
      for (const err of jsonStats.errors) {
        console.error(err);
      }
      process.exit(1);
    }
  };

  if (isProduction) {
    const configs = [clientConfig, serverConfig];
    const bundler = webpack(configs);
    bundler.run((err, stats) => {
      handleError(err, stats);
      taskEnd("build");
    });
  } else {
    const clientCompiler = webpack(clientConfig);
    const serverCompiler = webpack(serverConfig);
    let isServerRunning = false;

    clientCompiler.run((err, stats) => {
      handleError(err, stats);
      serverCompiler.watch({}, (err, stats) => {
        handleError(err, stats);
        if (!isServerRunning) {
          isServerRunning = true;
          // run server
          const monitor = nodemon({
            script: path.resolve(__dirname, "../build/server.js"),
          });
          process.once("SIGINT", function() {
            monitor.once("exit", function() {
              process.exit();
            });
          });
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
        }
        serverCompiler.run(handleError);
      });
    });
  }
};

// hot module replacement
if (require.main === module) {
  const isProduction = process.argv.includes("--production");
  build(isProduction);
}

export default build;
