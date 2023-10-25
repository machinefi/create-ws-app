import { task } from "hardhat/config";

task(
  "grant-rewards-minter",
  "Grant rewards minter role to an address",
).setAction(async (_, hre) => {
  const { deployments } = hre;
  const [deployer] = await hre.ethers.getSigners();

  const DeviceRewards = await deployments.get("DeviceRewards");
  const rewards = await hre.ethers.getContractAt(
    "DeviceRewards",
    DeviceRewards.address,
    deployer,
  );

  const minterRole = await rewards.MINTER_ROLE();
  const tx = await rewards.grantRole(minterRole, process.env.OPERATOR_ADDRESS);
  await tx.wait();

  console.log(`Minter role granted to ${process.env.OPERATOR_ADDRESS}`);
});

task("update-rewards-uri", "Update rewards uri").setAction(async (_, hre) => {
  const { deployments } = hre;
  const [deployer] = await hre.ethers.getSigners();

  const DeviceRewards = await deployments.get("DeviceRewards");
  const rewards = await hre.ethers.getContractAt(
    "DeviceRewards",
    DeviceRewards.address,
    deployer,
  );

  const tx = await rewards.setURI(process.env.REWARDS_URI || "");
  await tx.wait();

  console.log(`DeviceRewards uri updated to ${process.env.REWARDS_URI}`);
});
