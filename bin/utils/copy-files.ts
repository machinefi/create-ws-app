import fs from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function copyTemplates(
  projectPath: string,
  templatePath: string,
  subdirs: { [key: string]: string }
) {
  for (const [subdir, template] of Object.entries(subdirs)) {
    const templateSubdirPath = path.join(__dirname, templatePath, template);
    const projectSubdirPath = path.join(projectPath, subdir);
    fs.copySync(templateSubdirPath, projectSubdirPath);
  }
}

export function copyBlockchainFeatures(
  projectPath: string,
  templatePath: string,
  blockchainFeatures: string[]
) {
  blockchainFeatures.forEach((feature) => {
    const templateSubdirPath = path.join(
      __dirname,
      templatePath,
      "extensions",
      feature
    );
    const projectSubdirPath = path.join(projectPath, "blockchain");
    copyBlockchainFeature(templateSubdirPath, projectSubdirPath);

    addFeatureTaskToIndex(projectSubdirPath, feature);
  });
}

export function copyAppletHandlers(
  projectPath: string,
  templatePath: string,
  appletHandlers: string[]
) {
  appletHandlers.forEach((handler) => {
    const templateSubdirPath = path.join(
      __dirname,
      templatePath,
      "extensions",
      "applet",
      handler
    );

    const projectSubdirPath = path.join(projectPath, "applet", "assembly");
    const projectHandlersPath = path.join(projectSubdirPath, "handlers");

    copyAppletHandler(templateSubdirPath, projectHandlersPath);
    addHandlerToIndex(projectSubdirPath, handler);
  });
}

function copyBlockchainFeature(
  templateSubdirPath: string,
  projectSubdirPath: string
) {
  const subdirs = ["contracts", "test", "tasks", "deploy"];

  subdirs.forEach((subdir) => {
    const source = path.join(templateSubdirPath, subdir);
    const destination = path.join(projectSubdirPath, subdir);

    fs.copySync(source, destination);
  });
}

function copyAppletHandler(
  templateSubdirPath: string,
  projectSubdirPath: string
) {
  fs.copySync(templateSubdirPath, projectSubdirPath);
}

function addHandlerToIndex(projectSubdirPath: string, handler: string) {
  const handlerIndex = path.join(projectSubdirPath, "index.ts");
  if (handler === "binding") {
    fs.appendFileSync(handlerIndex, `\nexport * from "./handlers/binding";`);
  }
  if (handler === "start") {
    fs.appendFileSync(handlerIndex, `\nexport * from "./handlers/start";`);
  }
}

function addFeatureTaskToIndex(projectSubdirPath: string, feature: string) {
  const taskIndex = path.join(projectSubdirPath, "tasks", "index.js");
  if (feature === "erc20") {
    fs.appendFileSync(taskIndex, `\nrequire("./erc20");`);
  }
  if (feature === "erc721") {
    fs.appendFileSync(taskIndex, `\nrequire("./nft");`);
  }
  if (feature === "binding") {
    fs.appendFileSync(taskIndex, `\nrequire("./binding");`);
  }
}
