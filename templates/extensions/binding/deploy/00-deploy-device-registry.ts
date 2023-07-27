import { addEnvVarToWSProjectConfig } from "../utils/update-envs";
import { updateContractMonitor } from "../utils/update-monitor";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deploy } = deployments;
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();
  const tx = await deploy("DeviceRegistry", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log("DeviceRegistry deployed at block: ", tx.receipt?.blockNumber);

  if (chainId !== "31337") {
    updateContractMonitor({
      eventType: "ON_DEVICE_REGISTERED",
      chainID: Number(chainId),
      contractAddress: tx.address,
      blockStart: tx.receipt?.blockNumber || 20400000,
      blockEnd: 0,
      topic0:
        "0x543b01d8fc03bd0f400fb055a7c379dc964b3c478f922bb2e198fa9bccb8e714",
    });
    addEnvVarToWSProjectConfig({
      envName: "CHAIN_ID",
      envValue: chainId,
    });
  }
};

export default func;
func.tags = ["DeviceRegistry"];
