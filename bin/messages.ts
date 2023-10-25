import c from "chalk";

import { Args } from "./types.js";

export const appletInstructions = (args: Args) => `
${c.cyan("🧑‍💻 To get started with WS Applet, type the following commands:")}
cd ${args.directory}/applet
${c.bold("npm run test")}
${c.bold("npm run asbuild")}
`;

export const simulatorInstructions = (args: Args) => `
${c.cyan("🤖 To get started with Simulator, type the following commands:")}
cd ${args.directory}/simulator
touch .env ${c.dim("// and add your w3bstream vars to .env file")}
${c.bold("npm start")}
`;

export const blockchainInstructions = (args: Args) => `
${c.cyan(
  "🔗 To get started with onchain functionallity, type the following commands:",
)}
cd ${args.directory}/blockchain
touch .env ${c.dim("// and add your IoTeX Private Key to .env file")}
npm run test
${c.bold("npm run deploy")}
${c.bold("npm run deploy:testnet")}
`;
