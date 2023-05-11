task("bind-device", "Bind a device to a user")
    .addParam("deviceid", "Id of the device")
    .addParam("userid", "Id of the user")
    .setAction(async (taskArgs, hre) => {
        const { deviceid, userid } = taskArgs;
        const { deployments } = hre;
        const [deployer] = await ethers.getSigners();

        const DeviceBinding = await deployments.get("DeviceBinding");
        const deviceBinding = await ethers.getContractAt(
            "DeviceBinding",
            DeviceBinding.address,
            deployer
        );

        const tx = await deviceBinding.bindDevice(deviceid, userid);
        await tx.wait();

        console.log(`Device ${deviceid} binded to user ${userid}`);
    });