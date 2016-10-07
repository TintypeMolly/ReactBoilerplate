/* eslint-disable no-console */
import path from "path";
import {exec, spawn} from "child-process-promise";
import opn from "opn";

import build from "./build";
import {taskStart, taskEnd, catchPromiseReject} from "./util";

const test = async() => {
  await build();
  taskStart("test");

  const istanbul = spawn("babel-node", [
    "./node_modules/istanbul/lib/cli",
    "cover",
    "./node_modules/.bin/_mocha",
    "--report",
    "json",
    "--",
    "--colors",
  ]);
  istanbul.childProcess.stdout.on("data", data => {
    process.stdout.write(data.toString());
  });
  istanbul.childProcess.stderr.on("data", data => {
    process.stderr.write(data.toString());
  });
  await istanbul;

  const remapBaseCommand = "remap-istanbul -i coverage/coverage-final.json -e assets,external,~,webpack";
  await Promise.all([
    exec(`${remapBaseCommand} -o coverage/html -t html`),
    exec(`${remapBaseCommand} -o coverage/lcov.info -t lcovonly`),
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
