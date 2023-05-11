import meow, { Result } from "meow";
import c from "chalk";

import { Flags } from "./types";

const cli: Result<Flags> = meow(
  `
    ${c.bold("USAGE")}
      $ npx create-ws-app <project-name> [options]
  
    ${c.bold("OPTIONS")}
      --blockchain, -b  Include a blockchain template
      --simulator, -s   Include a simulator template
      --applet, -a      Include an applet template
      --erc20, -e       Include an ERC20 template
      --erc721, -n      Include an ERC721 template
      --help            Display this message
  
    ${c.bold("EXAMPLES")}
      $ npx create-ws-app
      $ npx create-ws-app simple-grid-with-token --blockchain --erc20
      $ npx create-ws-app energy-meter-simulator -s
    `,
  {
    importMeta: import.meta,
    flags: {
      blockchain: {
        type: "boolean",
        shortFlag: "b",
      },
      simulator: {
        type: "boolean",
        shortFlag: "s",
      },
      applet: {
        type: "boolean",
        shortFlag: "a",
      },
      erc20: {
        type: "boolean",
        shortFlag: "e",
      },
      erc721: {
        type: "boolean",
        shortFlag: "n",
      },
    },
  }
);

export default cli;
