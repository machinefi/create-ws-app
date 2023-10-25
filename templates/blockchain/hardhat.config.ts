import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
import "dotenv/config";

import "./tasks";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    testnet: {
      url: "https://babel-api.testnet.iotex.io",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    mainnet: {
      url: "https://babel-api.mainnet.iotex.io",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
