task("register-device", "Register a device")
  .addParam("deviceid", "Id of the device")
  .setAction(async (taskArgs, hre) => {
    const { deviceid } = taskArgs;
    const { deployments } = hre;
    const [deployer] = await ethers.getSigners();

    const DevicesRegistry = await deployments.get("DevicesRegistry");
    const deviceRegistry = await ethers.getContractAt(
      "DevicesRegistry",
      DevicesRegistry.address,
      deployer
    );

    const tx = await deviceRegistry.registerDevice(deviceid);
    await tx.wait();

    console.log(`Device ${deviceid} registered`);
  });
