import { ethers } from "hardhat";
import { expect } from "chai";
import { DeviceRegistry } from "../typechain-types";

const DEVICE1 =
  "0x9fa25c908f0955a0174b396f8f2dc4f7ec88316e37ee06bdc0115f3e5b6df6c1";
const DEVICE2 =
  "0xbca809a5cc11eb022d14ddfe49691325d7176d79973a2cf7f81795e18ec722ed";
const DEVICE3 =
  "0xffe87b6de33486c8bbfd575b45cf72be800d387bb803f9187528b22125045360";
const DEVICE4 =
  "0x6ac641c08cddf37c7f5018f418b6c10d9fcfe1498423f4a2cb35cb2fb3d0c796";

async function setup() {
  const deviceRegistry = await ethers.getContractFactory("DeviceRegistry");
  const deviceRegistryInstance = await deviceRegistry.deploy();
  await deviceRegistryInstance.deployed();

  const contracts = {
    DeviceRegistry: deviceRegistryInstance as DeviceRegistry,
  };

  return {
    ...contracts,
  };
}

describe("Device Registry", function () {
  it("Should deploy Device Registry", async function () {
    const { DeviceRegistry } = await setup();

    expect(DeviceRegistry.address).to.not.equal(0);
  });
  describe("Device registration", function () {
    it("Should register one device", async function () {
      const { DeviceRegistry } = await setup();

      await DeviceRegistry.registerDevice(DEVICE1);

      const isAuthorized = await DeviceRegistry.isAuthorizedDevice(DEVICE1);
      expect(isAuthorized).to.equal(true);
    });
    it("Should revert if one of the devices in batch is already registered", async function () {
      const { DeviceRegistry } = await setup();

      await DeviceRegistry.registerDevice(DEVICE1);

      await expect(
        DeviceRegistry.registerDevices([DEVICE1, DEVICE2])
      ).to.be.revertedWith("Device already registered");
    });
    it("Should register devices in a batch", async function () {
      const { DeviceRegistry } = await setup();

      await DeviceRegistry.registerDevices([
        DEVICE1,
        DEVICE2,
        DEVICE3,
        DEVICE4,
      ]);

      const isAuthorized1 = await DeviceRegistry.isAuthorizedDevice(DEVICE1);
      const isAuthorized2 = await DeviceRegistry.isAuthorizedDevice(DEVICE2);
      const isAuthorized3 = await DeviceRegistry.isAuthorizedDevice(DEVICE3);
      const isAuthorized4 = await DeviceRegistry.isAuthorizedDevice(DEVICE4);

      expect(isAuthorized1).to.equal(true);
      expect(isAuthorized2).to.equal(true);
      expect(isAuthorized3).to.equal(true);
      expect(isAuthorized4).to.equal(true);
    });
    it("Should emit events when registering devices in a batch", async function () {
      const { DeviceRegistry } = await setup();

      const tx = await DeviceRegistry.registerDevices([DEVICE1, DEVICE2]);

      await expect(tx)
        .to.emit(DeviceRegistry, "DeviceRegistered")
        .withArgs(DEVICE1);
      await expect(tx)
        .to.emit(DeviceRegistry, "DeviceRegistered")
        .withArgs(DEVICE2);
    });
    it("Should show registered devices and register unregistered devices", async function () {
      const { DeviceRegistry } = await setup();
      const devicesIds = [DEVICE1, DEVICE2, DEVICE3, DEVICE4];

      await DeviceRegistry.registerDevice(DEVICE3);

      const isAuthorizedBatch = await DeviceRegistry.isAuthorizedDevices(
        devicesIds
      );

      expect(isAuthorizedBatch).to.deep.equal([false, false, true, false]);

      await DeviceRegistry.registerDevices(
        devicesIds.filter((_, id) => !isAuthorizedBatch[id])
      );

      const isAuthorizedBatch2 = await DeviceRegistry.isAuthorizedDevices(
        devicesIds
      );

      expect(isAuthorizedBatch2).to.deep.equal([true, true, true, true]);
    });
  });
  describe("Device status", function () {
    it("Should return false if device is not registered", async function () {
      const { DeviceRegistry } = await setup();

      const isAuthorized = await DeviceRegistry.isAuthorizedDevice(DEVICE1);
      expect(isAuthorized).to.equal(false);
    });
    it("Should return false if device is suspended", async function () {
      const { DeviceRegistry } = await setup();

      await DeviceRegistry.registerDevice(DEVICE1);
      await DeviceRegistry.suspendDevice(DEVICE1);

      const isAuthorized = await DeviceRegistry.isAuthorizedDevice(DEVICE1);
      expect(isAuthorized).to.equal(false);
    });
    it("Should return false if device has been removed", async function () {
      const { DeviceRegistry } = await setup();

      await DeviceRegistry.registerDevice(DEVICE1);
      await DeviceRegistry.removeDevice(DEVICE1);

      const isAuthorized = await DeviceRegistry.isAuthorizedDevice(DEVICE1);
      expect(isAuthorized).to.equal(false);
    });
  });
});
