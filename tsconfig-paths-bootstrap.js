const tsConfig = require('./tsconfig.json');
const fs = require('fs');

const buildDir = tsConfig.compilerOptions.outDir;
const srcDir = 'src/';
const paths = tsConfig.compilerOptions.paths;
const pathKeys = Object.keys(paths);
const fileRegex = new RegExp(/.*\.js$/);
let processedDirs = 0;
let processedFiles = 0;

async function fixPaths(baseDir, deep = 0) {
  processedDirs++;
  const rawFiles = fs.readdirSync(baseDir, { withFileTypes: true });
  const directories = rawFiles
    .filter((file) => file.isDirectory())
    .map((directory) => baseDir + directory.name + '/');
  const filesToProcess = rawFiles
    .filter((file) => !file.isDirectory())
    .filter((file) => fileRegex.test(file.name))
    .map((file) => file.name);

  const rootPath = !deep ? './' : '../'.repeat(deep);

  for (let i = 0; i < filesToProcess.length; i++) {
    processedFiles++;
    let result = fs.readFileSync(baseDir + filesToProcess[i], 'utf8');

    for (let k = 0; k < pathKeys.length; k++) {
      const path = paths[pathKeys[k]][0].replace(srcDir, rootPath);
      const replaceRegex = new RegExp(`('|")${pathKeys[k]}("|')`, 'g');

      result = result.replace(replaceRegex, `"${path}"`);
    }

    await fs.writeFileSync(baseDir + filesToProcess[i], result, 'utf8');
  }

  deep++;
  for (let i = 0; i < directories.length; i++) {
    await fixPaths(directories[i], deep);
  }
}

new Promise((resolve, reject) => {
  (async () => {
    try {
      await fixPaths(buildDir + '/');
      resolve();
    } catch (e) {
      reject(e);
    }
  })();
})
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Processed directories:', processedDirs);
    // eslint-disable-next-line no-console
    console.log('Processed files: ', processedFiles);
  })
  // eslint-disable-next-line no-console
  .catch((e) => console.log(e));
