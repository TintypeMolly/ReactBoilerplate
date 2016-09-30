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

const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);
let isServerRunning = false;

clean();

taskStart("start");
clientCompiler.run((err, stats) => {
  handleWebpackError(err, stats);
  serverCompiler.watch({}, (err, stats) => {
    handleWebpackError(err, stats);
    if (!isServerRunning) {
      taskEnd("start");
      isServerRunning = true;

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
    }
    serverCompiler.run(handleWebpackError);
  });
});
