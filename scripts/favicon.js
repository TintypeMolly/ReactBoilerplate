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
        fs.writeFileSync(filename, file.contents);
      }
      const faviconJs = path.resolve(__dirname, "../src/components/structures/Html/favicon.js");
      const contents = ["import React from \"react\";\nexport default [\n"];
      for (let idx = 0; idx < response.html.length; idx += 1) {
        const el = response.html[idx];
        const replaced = el.replace(/^(<[^ ]+)([^>]*)>$/, (a, b, c) => `  ${b} key=\{${idx}\}${c}/>,\n`);
        contents.push(replaced);
      }
      contents.push("];\n");
      fs.outputFileSync(faviconJs, contents.join(""));
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
