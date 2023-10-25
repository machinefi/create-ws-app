import { DeployFunction } from "hardhat-deploy/types";
import { updateContractMonitor } from "../utils/update-monitor";
import { addEnvVarToWSProjectConfig } from "../utils/update-envs";

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deploy } = deployments;
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();
  const DeviceRegistry = await deployments.get("DeviceRegistry");

  const tx = await deploy("DeviceBinding", {
    from: deployer,
    args: [DeviceRegistry.address],
    log: true,
  });

  console.log("DeviceBinding deployed at block: ", tx.receipt?.blockNumber);

  if (chainId !== "31337") {
    updateContractMonitor({
      eventType: "ON_DEVICE_BOUND",
      chainID: Number(chainId),
      contractAddress: tx.address,
      blockStart: tx.receipt?.blockNumber || 20400000,
      blockEnd: 0,
      topic0:
        "0x79e9049c280370b9eda34d20f57456b7dcc94e83ac839777f71209901f780f48",
    });
    addEnvVarToWSProjectConfig({
      envName: "CHAIN_ID",
      envValue: chainId,
    });
  }
};

func.tags = ["DeviceBinding"];
export default func;
