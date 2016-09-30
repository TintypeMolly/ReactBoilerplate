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
  catchPromiseReject(clean());
}

export default clean;
