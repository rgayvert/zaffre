//
// This script creates a new app within the zaffre monorepo.
//
// To use it, make sure you're in the root directory of the workspace. Then run:
//
//         pnpm create-app <your-app-name>
//
// This should create the folder <workspace-root>/apps/<your-app-name>.
//
// Test it with:
//
//         cd apps/<your-app-name>; vite
//
// This should start up a dev server on 5173 (or next available). In your browser, go to localhost:5173.
//


const fs = require("fs");

if (process.argv.length === 2) {
  console.log("Usage: node create-zaffre-app.js <app-name>");
  process.exit(-1);
}

const appName = process.argv[2];
const lowerName = appName.toLowerCase();
const upperName = appName[0].toUpperCase() + appName.slice(1);
const appDir = `./apps/${lowerName}`;
try {
  if (fs.existsSync(`${appDir}`)) {
    console.error(`Directory ${appDir} already exists.`);
    process.exit(-1);
  }
} catch (err) {
  console.error(err);
  process.exit(-1);
}

const srcDir = `${appDir}/src`;
const publicDir = `${appDir}/public`;

fs.mkdirSync(appDir);
fs.mkdirSync(srcDir);
fs.mkdirSync(publicDir);

function copyFiles() {
  const templateFiles = [
    [".", "package.json", packageJson],
    ["src", "<UPPERNAME>App.ts", appTS],
    ["src", "<UPPERNAME>View.ts", viewTS],
    ["src", "<LOWERNAME>.ts", startTS],
    ["src", "vite-env.d.ts", viteEnvTS],
    [".", "index.html", indexHTML],
    [".", "tsconfig.json", tsConfigJSON],
    [".", "vite.config.js", viteConfigJS],
  ];
  const otherFiles = ["./.gitignore"];

  otherFiles.forEach((file) => {
    console.log(`copying ${file} to ${appDir}/${file}`);
    fs.copyFileSync(file, `${appDir}/${file}`);
  });

  fs.cpSync("./packages/zaffre/assets", `${publicDir}`, { recursive: true });

  templateFiles.forEach(([dir, filename, text]) => {
    const newText = text
      .replaceAll("<APPNAME>", appName)
      .replaceAll("<LOWERNAME>", lowerName)
      .replaceAll("<UPPERNAME>", upperName);

    const destDir = dir === "." ? appDir : `${appDir}/${dir}`;
    const newFile = filename
      .replaceAll("<APPNAME>", appName)
      .replaceAll("<LOWERNAME>", lowerName)
      .replaceAll("<UPPERNAME>", upperName);

    const destFile = `${destDir}/${newFile}`;
    console.log(`writing ${destFile}`);
    fs.writeFileSync(destFile, newText);
  });
}

tsConfigJSON = `{
    "extends": "../../tsconfig-base.json",
    "compilerOptions": {
      "outDir": "lib",
  }
}
`;


appTS = `import { App, AppContext } from "zaffre";
import { <UPPERNAME> } from "./<UPPERNAME>View";

export class <UPPERNAME>App extends App {
  constructor(context = AppContext.Web) {
    super(context);
    this.startWith(() => <UPPERNAME>(), context);
  }
}
`;

viewTS = `import { core, VStack, TextLabel, View, ch } from "zaffre";

export function <UPPERNAME>(): View {
  return VStack({ alignItems: "center", padding: core.space.s6, minWidth: ch(65) }).append(
    TextLabel("Hello World", {
      color: core.color.primary,
      font: core.font.headline_medium,
    })
  );
}


`;

viteConfigJS = `import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "./",
  plugins: [
    tsconfigPaths(), 
  ],
  build: {
    rollupOptions: { 
      input: "src/<LOWERNAME>.ts", 
      treeshake: "smallest"
    },
  },
});
`;

packageJson = `{
  "name": "<LOWERNAME>",
  "version": "1.0.0",
  "description": "<APPNAME>",
  "type": "module",
  "scripts": {
    "compile": "tsc --build",
    "build": "pnpm vite build",
    "circles": "npx dpdm src/<LOWERNAME>.ts",
    "clean": "rimraf dist lib"
  },
  "license": "ISC",
  "devDependencies": {
    "path": "^0.12.7",
    "vite": "5.2.10",
    "vite-tsconfig-paths": "^4.3.2"
  }
}
`;

startTS = `import { <UPPERNAME>App } from "./<UPPERNAME>App";

new <UPPERNAME>App();
`;

indexHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><APPNAME></title>
    <link rel="icon" type="image/x-icon" href="./assets/favicon.ico">
  </head>
  <body>
    <script type="module" src="/src/<LOWERNAME>.ts"></script>
  </body>
</html>
`;

viteEnvTS = `/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
`;

copyFiles();
