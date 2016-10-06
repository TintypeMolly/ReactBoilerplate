/* eslint-disable no-console */
import fs from "fs-extra-promise";
import cp from "child-process-promise"
import path from "path";
import build from "./build";
import {taskStart, taskEnd, catchPromiseReject} from "./util";

const test = async() => {
  await build();
  taskStart("test");
  const srcFilePath = path.resolve(__dirname, "../build/assets.js");
  const dstFilePath = path.resolve(__dirname, "../src/assets.js");
  await fs.copyAsync(srcFilePath, dstFilePath);
  console.log(`Copied ${srcFilePath}`);

  try {
    let res = await cp.exec("babel-node ./node_modules/.bin/babel-istanbul cover _mocha -- --compilers js:babel-core/register --require ignore-styles --colors --reporter dot test/");
    console.log(res.stdout);
  }
  catch(e) {
    console.log(e.stdout);
    console.log(e.stderr);
  }

  await fs.removeAsync(srcFilePath);
  console.log(`Deleted ${dstFilePath}`);
  taskEnd("test");
};

if (require.main === module) {
  catchPromiseReject(test());
}

export default test;
