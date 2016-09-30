import path from "path";
import fs from "fs-extra";
import favicons from "favicons";

import packageJson from "../package.json";
import {FAVICON} from "../config";
import {taskStart, taskEnd} from "./util";

/* eslint-disable no-console */

const outputDir = path.resolve(__dirname, "../src/public/favicon");

if (require.main === module) {
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
}

const copyFavicons = () => {
  const buildPath = path.resolve(__dirname, "../build/public");
  if (!fs.statSync(outputDir).isDirectory() || fs.readdirSync(outputDir).length === 0) {
    throw new Error("Favicons are not generated. Please run \"npm run favicon\"");
  }
  const files = fs.readdirSync(outputDir);
  for (const filename of files) {
    console.log(`Copied ${filename}...`);
    fs.copySync(path.join(outputDir, filename), path.join(buildPath, filename));
  }
};

export {
  copyFavicons,
};
