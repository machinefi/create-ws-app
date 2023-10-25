import path from "path";

import { Args } from "../types";

export function extractSubdirsAndFeatures(args: Args): {
  subdirs: { [key: string]: string };
  blockchainFeatures: string[];
  appletHandlers: string[];
} {
  const subdirs: { [key: string]: string } = {};
  const blockchainFeatures: string[] = [];
  const appletHandlers: string[] = ["start"];

  const appletPath = args.minimal ? path.join("light", "applet") : "applet";
  subdirs.applet = appletPath;

  if (args.binding || args.erc20 || args.erc721 || args.erc1155 || args.sbt) {
    subdirs.blockchain = "blockchain";
    addBlockchainFeatures(args, blockchainFeatures);
  }

  if (args.binding) {
    pushStringToArray(appletHandlers, "binding");
  }

  if (args.erc20) {
    pushStringToArray(appletHandlers, "erc20");
  }

  if (args.simulator) {
    subdirs.simulator = "simulator";
  }

  return { subdirs, blockchainFeatures, appletHandlers };
}

function addBlockchainFeatures(args: Args, blockchainFeatures: string[]) {
  if (args.binding) {
    pushStringToArray(blockchainFeatures, "binding");
  }
  if (args.erc20) {
    pushStringToArray(blockchainFeatures, "erc20");
  }
  if (args.erc721) {
    pushStringToArray(blockchainFeatures, "erc721");
  }
  if (args.erc1155) {
    pushStringToArray(blockchainFeatures, "erc1155");
  }
  if (args.sbt) {
    pushStringToArray(blockchainFeatures, "sbt");
  }
}

function pushStringToArray(subdirs: string[], template: string) {
  subdirs.push(template);
}
