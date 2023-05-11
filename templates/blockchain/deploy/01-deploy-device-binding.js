module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const DevicesRegistry = await deployments.get("DevicesRegistry");

  await deploy("DeviceBinding", {
    from: deployer,
    args: [DevicesRegistry.address],
    log: true,
  });
};
module.exports.tags = ["DeviceBinding"];
