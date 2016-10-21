import path from "path";
import opn from "opn";

import build from "./build";
import {taskStart, taskEnd, catchPromiseReject, spawn} from "./util";

const test = async() => {
  await build();
  taskStart("test");

  await spawn("babel-node", [
    "./node_modules/istanbul/lib/cli",
    "cover",
    "./node_modules/mocha/bin/_mocha",
    "--report",
    "json",
    "--",
    "--colors",
  ]);

  const remapBaseArgs = ["-i", "coverage/coverage-final.json", "-e", "assets,external,~,webpack"];
  await Promise.all([
    spawn("remap-istanbul", [...remapBaseArgs, "-o", "coverage/html", "-t", "html"]),
    spawn("remap-istanbul", [...remapBaseArgs, "-o", "coverage/lcov.info", "-t", "lcovonly"]),
  ]);

  taskEnd("test");
  opn(path.resolve(__dirname, "../coverage/html/index.html"), {
    wait: false,
  });
};

if (require.main === module) {
  catchPromiseReject(test());
}

export default test;
