module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const tx = await deploy("ExampleTokenERC721", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log("ExampleTokenERC721 deployed at block: ", tx.receipt.blockNumber);
};
module.exports.tags = ["ExampleTokenERC721"];
