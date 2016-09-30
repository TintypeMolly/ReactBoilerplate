import path from "path";
import fs from "fs-extra-promise";
import favicons from "favicons";

import packageJson from "../package.json";
import {FAVICON} from "../src/config";
import {taskStart, taskEnd, catchPromiseReject} from "./util";

/* eslint-disable no-console */

const outputDir = path.resolve(__dirname, "../src/public/favicon");
const faviconJs = path.resolve(__dirname, "../src/components/structures/Html/favicon.js");

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
  const promises = [];
  for (const image of response.images) {
    const filename = path.join(outputDir, image.name);
    promises.push(fs.outputFile(filename, image.contents));
  }
  for (const file of response.files) {
    const filename = path.join(outputDir, file.name);
    promises.push(fs.outputFile(filename, file.contents));
  }
  const contents = ["import React from \"react\";\nexport default [\n"];
  for (let idx = 0; idx < response.html.length; idx += 1) {
    const el = response.html[idx];
    const replaced = el.replace(/^(<[^ ]+)([^>]*)>$/, (a, b, c) => `  ${b} key=\{${idx}\}${c}/>,\n`);
    contents.push(replaced);
  }
  contents.push("];\n");
  promises.push(fs.outputFile(faviconJs, contents.join("")));
  await Promise.all(promises);
  taskEnd("favicon");
};

const copyFavicon = async() => {
  const faviconExists = await fs.existsAsync(faviconJs);
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
  generateFavicon,
  copyFavicon,
};
