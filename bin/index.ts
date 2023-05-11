#!/usr/bin/env node

import fs from "fs-extra";
import { execa } from "execa";
import ora from "ora";
import path from "path";
import c from "chalk";

import { normalizeArgs } from "./utils/normalize-args.js";
import {
  copyTemplates,
  copyBlockchainFeatures,
  extractSubdirsAndFeatures,
  copyAppletHandlers,
} from "./utils/helpers.js";
import meowCli from "./meow-cli.js";
import { Args } from "./types.js";
import {
  appletInstructions,
  blockchainInstructions,
  simulatorInstructions,
} from "./messages.js";

const TEMPLATE_DIR_NAME = "../../templates";

function copyFiles(args: Args) {
  fs.ensureDirSync(args.directory);

  const { subdirs, blockchainFeatures, appletHandlers } =
    extractSubdirsAndFeatures(args);

  copyTemplates(args.directory, TEMPLATE_DIR_NAME, subdirs);

  if (args.binding || args.erc20 || args.erc721) {
    copyBlockchainFeatures(
      args.directory,
      TEMPLATE_DIR_NAME,
      blockchainFeatures
    );
  }
  copyAppletHandlers(args.directory, TEMPLATE_DIR_NAME, appletHandlers);
}

async function installDependencies(args: Args) {
  const subdirs = extractSubdirsAndFeatures(args).subdirs;

  process.stdout.write("\n");

  for (let i = 0; i < subdirs.length; i++) {
    const subdir = subdirs[i];
    const spinner = ora(`Installing dependencies for ${subdir}...`).start();

    process.chdir(path.join(args.directory, subdir));

    try {
      await execa("npm", ["install"]);
      spinner.succeed(`${subdir} dependencies installed!`);
    } catch (error) {
      spinner.fail(`${subdir} dependencies failed to install!`);
      throw error;
    }
  }

  logFinalMessage(args);
}

function logFinalMessage(args: Args) {
  console.log(`
                                      
  __  _  ________ _____  ______ ______  
  \\ \\/ \\/ /  ___/ \\__  \\ \\____ \\\\____ \\ 
   \\     /\\___ \\   / __ \\|  |_> >  |_> >
    \\/\\_//____  > (____  /   __/|   __/ 
              \\/       \\/|__|   |__|      

  🎉  Project ${c.bold(args.directory)} is ready!
  ${appletInstructions(args)}
  ${args.simulator ? simulatorInstructions(args) : ""}
  ${
    args.binding || args.erc20 || args.erc721
      ? blockchainInstructions(args)
      : ""
  }
  `);
}

(async () => {
  const args = await normalizeArgs(meowCli);
  copyFiles(args);
  await installDependencies(args);
})();
