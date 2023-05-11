task("add-erc20-minter", "Grant erc20 token minter role to an address")
  .addParam("address", "Address to grant minter role to")
  .setAction(async (taskArgs, hre) => {
    const { address } = taskArgs;
    const { deployments } = hre;
    const [deployer] = await ethers.getSigners();

    const Token = await deployments.get("Token");
    const token = await ethers.getContractAt("Token", Token.address, deployer);

    const minterRole = await token.MINTER_ROLE();
    const tx = await token.grantRole(minterRole, address);
    await tx.wait();

    console.log(`Minter role granted to ${address}`);
  });
