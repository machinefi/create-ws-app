/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require('hardhat-deploy');
require("dotenv").config();

require("./tasks");

module.exports = {
  solidity: "0.8.17",
  networks: {
    testnet: {
      url: "https://babel-api.testnet.iotex.io",
      accounts: [process.env.IOTEX_PRIVATE_KEY],
    },
    mainnet: {
      url: "https://babel-api.mainnet.iotex.io",
      accounts: [process.env.IOTEX_PRIVATE_KEY],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
