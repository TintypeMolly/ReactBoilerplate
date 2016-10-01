import path from "path";
import fs from "fs-extra-promise";
import favicons from "favicons";

import packageJson from "../package.json";
import {FAVICON} from "../src/config";
import {taskStart, taskEnd, catchPromiseReject} from "./util";

/* eslint-disable no-console */

const outputDir = path.resolve(__dirname, "../src/public/favicon");
const faviconJson = path.resolve(__dirname, "../src/components/structures/Html/favicon.json");

const generateFavicon = async() => {
  taskStart("favicon");

  // check existence of FAVICON
  if (!FAVICON) {
    throw Error("Set FAVICON in src/config.js");
  }
  const faviconExists = await fs.existsAsync(FAVICON);
  console.log(faviconExists);
  if (!faviconExists) {
    throw Error(`${FAVICON} does not exist. Set FAVICON properly in src/config.js`);
  }

  const response = await new Promise((resolve, reject) => {
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
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
  await fs.removeAsync(outputDir);
  await fs.mkdirsAsync(outputDir);
  const promises = [
    ...response.images.map(x => fs.outputFile(path.join(outputDir, x.name), x.contents)),
    ...response.files.map(x => fs.outputFile(path.join(outputDir, x.name), x.contents)),
    fs.outputFile(faviconJson, JSON.stringify(response.html)),
  ];
  await Promise.all(promises);
  taskEnd("favicon");
};

const copyFavicon = async() => {
  const faviconExists = await fs.existsAsync(faviconJson);
  if (!faviconExists) {
    // eslint-disable-next-line no-console
    console.warn("favicon is not built. Generating favicon...");
    await generateFavicon();
  }
  const buildPath = path.resolve(__dirname, "../build/public");
  // fs.readdirAsync returns empty Array right after generation without next line
  await new Promise(resolve => setTimeout(resolve, 0));
  const files = await fs.readdirAsync(outputDir);
  const promises = files.map(f => fs.copyAsync(path.join(outputDir, f), path.join(buildPath, f)));
  await Promise.all(promises);
};

if (require.main === module) {
  catchPromiseReject(generateFavicon());
}

export {
  outputDir as faviconOutputDir,
  faviconJson,
  generateFavicon,
  copyFavicon,
};
