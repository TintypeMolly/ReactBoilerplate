/* eslint-disable no-console */
import fs from "fs-extra-promise";
import path from "path";
import {taskStart, taskEnd, catchPromiseReject} from "./util";
import {faviconJson, faviconOutputDir} from "./favicon";

const clean = async() => {
  taskStart("clean");
  const buildPath = path.resolve(__dirname, "../build");
  const coveragePath = path.resolve(__dirname, "../coverage");
  await Promise.all([
    fs.removeAsync(buildPath),
    fs.removeAsync(coveragePath),
  ]);
  console.log(`Removed ${buildPath}`);
  taskEnd("clean");
};

if (require.main === module) {
  catchPromiseReject(clean()).then(() => {
    // remove favicon build as well if --all was given
    if (process.argv.includes("--all")) {
      fs.removeAsync(faviconOutputDir);
      fs.removeAsync(faviconJson);
    }
  });
}

export default clean;
