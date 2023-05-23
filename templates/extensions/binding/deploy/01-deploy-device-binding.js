module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const DevicesRegistry = await deployments.get("DevicesRegistry");

  const tx = await deploy("DeviceBinding", {
    from: deployer,
    args: [DevicesRegistry.address],
    log: true,
  });
  console.log("DeviceBinding deployed at block: ", tx.receipt.blockNumber);
};
module.exports.tags = ["DeviceBinding"];
