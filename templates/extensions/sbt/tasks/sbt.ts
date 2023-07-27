import { task } from "hardhat/config";

task("grant-sbt-minter", "Grant sbt minter role to an address").setAction(
  async (_, hre) => {
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    const DeviceSBT = await deployments.get("DeviceSBT");
    const sbt = await hre.ethers.getContractAt(
      "DeviceSBT",
      DeviceSBT.address,
      deployer
    );

    const minterRole = await sbt.MINTER_ROLE();
    const tx = await sbt.grantRole(minterRole, process.env.OPERATOR_ADDRESS);
    await tx.wait();

    console.log(`Minter role granted to ${process.env.OPERATOR_ADDRESS}`);
  }
);

task("update-sbt-uri", "Update sbt URI")
  .setAction(async (_, hre) => {
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    const DeviceSBT = await deployments.get("DeviceSBT");
    const sbt = await hre.ethers.getContractAt(
      "DeviceSBT",
      DeviceSBT.address,
      deployer
    );

    const tx = await sbt.setURI(process.env.SBT_URI);
    await tx.wait();

    console.log(`SBT URI updated to ${process.env.SBT_URI}`);
  });

task("check-sbt-balance", "Check sbt balance of an address")
  .addParam("address", "Address to check")
  .setAction(async (taskArgs, hre) => {
    const { address } = taskArgs;
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    const DeviceSBT = await deployments.get("DeviceSBT");
    const sbt = await hre.ethers.getContractAt(
      "DeviceSBT",
      DeviceSBT.address,
      deployer
    );

    const balance = await sbt.balanceOf(address);
    console.log(`Balance of ${address}: ${balance}`);
  });

task("get-sbt-uri", "Get sbt URI")
  .addParam("id", "Token ID")
  .setAction(async (taskArgs, hre) => {
    const { id } = taskArgs;
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    const DeviceSBT = await deployments.get("DeviceSBT");
    const sbt = await hre.ethers.getContractAt(
      "DeviceSBT",
      DeviceSBT.address,
      deployer
    );

    const uri = await sbt.tokenURI(id);
    console.log(`URI of token ${id}: ${uri}`);
  });
