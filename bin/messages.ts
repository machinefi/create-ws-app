import c from "chalk";

import { Args } from "./types.js";

export const appletInstructions = (args: Args) => `
${c.cyan("To get started with Applet, type the following commands:")}
cd ${args.directory}/applet
${c.bold("npm run asbuild")}
`;

export const simulatorInstructions = (args: Args) => `
${c.cyan("To get started with Simulator, type the following commands:")}
cd ${args.directory}/simulator
touch .env ${c.dim("// and add your w3bstream vars to .env file")}
${c.bold("npm run start")}
`;

export const blockchainInstructions = (args: Args) => `
${c.cyan("To get started with Blockchain, type the following commands:")}
cd ${args.directory}/blockchain
touch .env
npm run test
${c.bold("npm run deploy")}
`;
