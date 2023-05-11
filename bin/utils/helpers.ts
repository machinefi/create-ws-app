import fs from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { Args } from "../types";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function extractSubdirsAndFeatures(args: Args) {
  const subdirs: string[] = ["applet"];
  const blockchainFeatures: string[] = [];

  if (args.blockchain) {
    addTemplate(subdirs, "blockchain");
    addBlockchainFeatures(args, blockchainFeatures);
  }

  if (args.simulator) {
    addTemplate(subdirs, "simulator");
  }

  return { subdirs, blockchainFeatures };
}

function addTemplate(subdirs: string[], template: string) {
  subdirs.push(template);
}

function addBlockchainFeatures(args: Args, blockchainFeatures: string[]) {
  if (args.erc20) {
    blockchainFeatures.push("erc20");
  }
  if (args.erc721) {
    blockchainFeatures.push("erc721");
  }
}

export function copyTemplates(
  projectPath: string,
  templatePath: string,
  subdirs: string[]
) {
  subdirs.forEach((subdir) => {
    const templateSubdirPath = path.join(__dirname, templatePath, subdir);
    const projectSubdirPath = path.join(projectPath, subdir);
    fs.copySync(templateSubdirPath, projectSubdirPath);
  });
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

function addFeatureTaskToIndex(projectSubdirPath: string, feature: string) {
  const taskIndex = path.join(projectSubdirPath, "tasks", "index.js");
  if (feature === "erc20") {
    fs.appendFileSync(taskIndex, `\nrequire("./erc20");`);
  }
  if (feature === "erc721") {
    fs.appendFileSync(taskIndex, `\nrequire("./nft");`);
  }
}
