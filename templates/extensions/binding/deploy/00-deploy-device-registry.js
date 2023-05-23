module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  
  const tx = await deploy("DevicesRegistry", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log("DevicesRegistry deployed at block: ", tx.receipt.blockNumber);
};
module.exports.tags = ["DevicesRegistry"];
