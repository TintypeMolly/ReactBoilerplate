/* eslint-disable no-console */
import fs from "fs-extra-promise";
import path from "path";
import {taskStart, taskEnd, catchPromiseReject} from "./util";

const clean = async() => {
  taskStart("clean");
  const buildPath = path.resolve(__dirname, "../build");
  await fs.removeAsync(buildPath);
  console.log(`Removed ${buildPath}`);
  taskEnd("clean");
};

if (require.main === module) {
  catchPromiseReject(clean()).then(() => {
    // remove favicon build as well if --all was given
    if (process.argv.includes("--all")) {
      fs.removeAsync(path.resolve(__dirname, "../src/public/favicon"));
      fs.removeAsync(path.resolve(__dirname, "../src/components/structures/Html/favicon.js"));
    }
  });
}

export default clean;
