import path from "path";
import fs from "fs-extra";
import favicons from "favicons";

import packageJson from "../package.json";
import {FAVICON} from "../config";
import {taskStart, taskEnd} from "./util";

/* eslint-disable no-console */

taskStart("favicon");
favicons(FAVICON, {
  appName: packageJson.name,
  appDescription: packageJson.description,
  developerName: packageJson.author,
  developerURL: packageJson.homepage,
  background: "#fff",
  version: packageJson.version,
  logging: true,
}, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    const outputDir = path.resolve(__dirname, "../src/public/favicon");
    fs.removeSync(outputDir);
    fs.mkdirsSync(outputDir);
    for (const image of response.images) {
      const filename = path.join(outputDir, image.name);
      const ws = fs.createWriteStream(filename);
      ws.write(image.contents);
    }
    for (const file of response.files) {
      const filename = path.join(outputDir, file.name);
      fs.writeFile(filename, file.contents);
    }
    console.log("Put these elements into <head>");
    for (const element of response.html) {
      console.log(element);
    }
    taskEnd("favicon");
  }
});
