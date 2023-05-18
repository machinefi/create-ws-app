import fs from "fs-extra";
import path from "path";
import enquirer from "enquirer";
import { Result } from "meow";

import { Flags } from "../types";

export async function normalizeArgs(cli: Result<Flags>) {
  const directory = await normalizeDirectory(cli);
  await normalizeFlags(cli);

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

async function normalizeFlags(cli: Result<Flags>) {
  if (cli.flags.minimal) {
    setFlagsValue(cli, false);
    return;
  }
  if (cli.flags.yes) {
    setFlagsValue(cli, true);
    return;
  }
  if (isAnyOfTheFlagsTrue(cli)) {
    return;
  }
  await promtAllFlags(cli);
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

function setFlagsValue(cli: Result<Flags>, value: boolean) {
  cli.flags.binding = value;
  cli.flags.erc20 = value;
  cli.flags.erc721 = value;
  cli.flags.simulator = value;
}

function isAnyOfTheFlagsTrue(cli: Result<Flags>) {
  return (
    cli.flags.binding ||
    cli.flags.erc20 ||
    cli.flags.erc721 ||
    cli.flags.simulator
  );
}

async function promtAllFlags(cli: Result<Flags>) {
  cli.flags.erc20 = await promtConfirmation("erc20");
  cli.flags.erc721 = await promtConfirmation("erc721");
  cli.flags.binding = await promtConfirmation("binding");
  cli.flags.simulator = await promtConfirmation("simulator");
}

async function promtConfirmation(tmpName: string) {
  const message = buildMessage(tmpName);
  const res = (await enquirer.prompt({
    type: "confirm",
    name: tmpName,
    message,
    initial: true,
  })) as { [key: string]: boolean };
  return res[tmpName] as boolean;
}

function buildMessage(tmpName: string) {
  const emoji = selectEmoji(tmpName);

  switch (tmpName) {
    case "simulator":
      return `${emoji} include a device ${tmpName} template?`;
    case "binding":
      return `${emoji} include an onchain device registration and binding template?`;
    case "erc20":
      return `${emoji} include an ${tmpName} token template?`;
    case "erc721":
      return `${emoji} include an ${tmpName} token template?`;
    default:
      return "";
  }
}

function selectEmoji(tmpName: string) {
  switch (tmpName) {
    case "binding":
      return "👤";
    case "erc20":
      return "💰";
    case "erc721":
      return "🖼️ ";
    case "simulator":
      return "🤖";
    default:
      return "";
  }
}
