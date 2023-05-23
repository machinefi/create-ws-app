module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const tx = await deploy("Token", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log("Token deployed at block: ", tx.receipt.blockNumber);
};
module.exports.tags = ["Token"];
