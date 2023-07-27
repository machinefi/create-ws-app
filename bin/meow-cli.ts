import meow, { Result } from "meow";
import c from "chalk";

import { Flags } from "./types";

const cli: Result<Flags> = meow(
  `
    ${c.bold("USAGE")}
      $ npx create-ws-app <project-name> [options]
  
    ${c.bold("OPTIONS")}
      --simulator, -s   Include a simulator template
      --binding, -b     Include an onchain device registration and binding template
      --erc20, -e       Include an ERC20 token template
      --erc721, -n      Include an ERC721 token template
      --sbt, -t         Include a soul bound token template
      --erc1155, -f     Include an ERC1155 token template
      --help, -h        Display this message
      --minimal, -m     Create a minimal applet without any tests and utils
      -y                Skip prompts and use yes as the answer for all prompts
  
    ${c.bold("EXAMPLES")}
      $ npx create-ws-app
      $ npx create-ws-app full-stack -y
      $ npx create-ws-app simple-app -m
      $ npx create-ws-app simple-grid-with-token --binding --erc20
      $ npx create-ws-app energy-meter-simulator -sbe
    `,
  {
    importMeta: import.meta,
    flags: {
      binding: {
        type: "boolean",
        shortFlag: "b",
      },
      simulator: {
        type: "boolean",
        shortFlag: "s",
      },
      erc20: {
        type: "boolean",
        shortFlag: "e",
      },
      erc721: {
        type: "boolean",
        shortFlag: "n",
      },
      sbt: {
        type: "boolean",
        shortFlag: "t",
      },
      erc1155: {
        type: "boolean",
        shortFlag: "f",
      },
      minimal: {
        type: "boolean",
        shortFlag: "m",
      },
      help: {
        type: "boolean",
        shortFlag: "h",
      },
      yes: {
        type: "boolean",
        shortFlag: "y",
      },
    },
  }
);

export default cli;
