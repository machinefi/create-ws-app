import fs from "fs-extra";
import path from "path";
import enquirer from "enquirer";
import { Result } from "meow";

import { Flags } from "../types";

export async function normalizeArgs(cli: Result<Flags>) {
  const directory = await normalizeDirectory(cli);
  await normalizeSimulator(cli);
  await normalizeBlockchain(cli);

  if (cli.flags.blockchain) {
    await normalizeBlockchainFeatures(cli);
  }

  return {
    directory,
    ...cli.flags,
  };
}

async function normalizeDirectory(cli: Result<Flags>) {
  let directory = cli.input[0];
  if (!directory) {
    directory = await promptDir();
  }
  return path.resolve(directory);
}

async function normalizeBlockchain(cli: Result<Flags>) {
  if (!cli.flags.blockchain) {
    cli.flags.blockchain = await promtConfirmation("blockchain");
  }
}

async function normalizeBlockchainFeatures(cli: Result<Flags>) {
  if (!cli.flags.erc20) {
    cli.flags.erc20 = await promtConfirmation("erc20");
  }

  if (!cli.flags.erc721) {
    cli.flags.erc721 = await promtConfirmation("erc721");
  }
}

async function normalizeSimulator(cli: Result<Flags>) {
  if (!cli.flags.simulator) {
    cli.flags.simulator = await promtConfirmation("simulator");
  }
}

async function promptDir() {
  const { directory } = (await enquirer.prompt({
    type: "input",
    name: "directory",
    message: "What directory should create-ws-app generate your app into?",
    initial: "my-ws-app",
    validate: (input) => {
      if (fs.existsSync(input)) {
        return `Directory ${input} already exists. Please try again.`;
      }
      return true;
    },
  })) as { directory: string };
  return directory;
}

async function promtConfirmation(tmpName: string) {
  const res = (await enquirer.prompt({
    type: "confirm",
    name: tmpName,
    message: `Include a ${tmpName} template?`,
    initial: true,
  })) as { [key: string]: boolean };
  return res[tmpName] as boolean;
}
