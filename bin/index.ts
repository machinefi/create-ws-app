#!/usr/bin/env node

import fs from "fs-extra";
import { execa } from "execa";
import ora from "ora";
import path from "path";
import c from "chalk";

import { normalizeArgs } from "./utils/normalize-args.js";
import { extractSubdirsAndFeatures } from "./utils/helpers.js";
import {
  copyTemplates,
  copyBlockchainFeatures,
  copyAppletHandlers,
} from "./utils/copy-files.js";
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

  for (const [subdir] of Object.entries(subdirs)) {
    const spinner = ora(`Installing ${c.bold(subdir)} dependencies...`);
    spinner.start();

    try {
      await execa("npm", ["install"], {
        cwd: path.join(args.directory, subdir),
      });
      spinner.succeed();
    } catch (err) {
      spinner.fail();
      console.error(err);
      process.exit(1);
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
