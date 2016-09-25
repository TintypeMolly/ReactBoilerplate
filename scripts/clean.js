/* eslint-disable no-console */
import fs from "fs-extra";
import path from "path";
import {taskStart, taskEnd} from "./util";

const clean = () => {
  taskStart("clean");
  const buildPath = path.resolve(__dirname, "../build");
  fs.removeSync(buildPath);
  console.log(`Removed ${buildPath}`);
  taskEnd("clean");
};

if (require.main === module) {
  clean();
}

export default clean;
