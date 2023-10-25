import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const tx = await deploy("Token", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log("Token deployed at block: ", tx.receipt.blockNumber);
};

func.tags = ["Token"];
export default func;
