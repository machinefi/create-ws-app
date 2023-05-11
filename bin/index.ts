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

  const { subdirs, blockchainFeatures } = extractSubdirsAndFeatures(args);

  copyTemplates(args.directory, TEMPLATE_DIR_NAME, subdirs);

  if (args.blockchain) {
    copyBlockchainFeatures(
      args.directory,
      TEMPLATE_DIR_NAME,
      blockchainFeatures
    );
  }
}

async function installDependencies(args: Args) {
  const subdirs = extractSubdirsAndFeatures(args).subdirs;

  await Promise.all(
    subdirs.map(async (subdir) => {
      const spinner = ora(`Installing dependencies for ${subdir}...`).start();

      process.chdir(path.join(args.directory, subdir));

      try {
        await execa("npm", ["install"]);
        spinner.succeed(`${subdir} dependencies installed!`);
      } catch (error) {
        spinner.fail(`${subdir} dependencies failed to install!`);
        throw error;
      }
    })
  );

  logFinalMessage(args);
}

function logFinalMessage(args: Args) {
  console.log(`
  ___   __     ____  ____  ____  __  __ _ 
 / __) /  \\   (    \\(  __)(  _ \\(  )(  ( \\
( (_ \\(  O )   ) D ( ) _)  ) __/ )( /    /
 \\___/ \\__/   (____/(____)(__)  (__)\\_)__)

  🎉  Project ${c.bold(args.directory)} is ready!
  ${appletInstructions(args)}
  ${args.simulator ? simulatorInstructions(args) : ""}
  ${args.blockchain ? blockchainInstructions(args) : ""}
  `);
}

(async () => {
  const args = await normalizeArgs(meowCli);
  copyFiles(args);
  await installDependencies(args);
})();
