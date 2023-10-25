import { task } from "hardhat/config";

task("register-device", "Register a device")
  .addParam("deviceid", "Id of the device")
  .setAction(async (taskArgs, hre) => {
    const { deviceid } = taskArgs;
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    const DeviceRegistry = await deployments.get("DeviceRegistry");
    const deviceRegistry = await hre.ethers.getContractAt(
      "DeviceRegistry",
      DeviceRegistry.address,
      deployer,
    );

    const tx = await deviceRegistry.registerDevice(deviceid);
    await tx.wait();

    console.log(`Device ${deviceid} registered`);
  });

task("bind-device", "Bind a device to a user")
  .addParam("deviceid", "Id of the device")
  .addParam("userid", "Id of the user")
  .setAction(async (taskArgs, hre) => {
    const { deviceid, userid } = taskArgs;
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    const DeviceBinding = await deployments.get("DeviceBinding");
    const deviceBinding = await hre.ethers.getContractAt(
      "DeviceBinding",
      DeviceBinding.address,
      deployer,
    );

    const tx = await deviceBinding.bindDevice(deviceid, userid);
    await tx.wait();

    console.log(`Device ${deviceid} binded to user ${userid}`);
  });
