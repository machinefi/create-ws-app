const { expect } = require("chai");
const hre = require("hardhat");

let devicesRegistry;
let deviceBinding;
let user, badGuy, user_2;

const DEVICE_ID_1 =
  "0x1234567890123456789012345678901234567890123456789012345678901234";
const DEVICE_ID_2 =
  "0x1234567890123456789012345678901234567890123456789012345678901235";
const DEVICE_ID_3 =
  "0x1234567890123456789012345678901234567890123456789012345678901236";
const ZERO_ADDR = hre.ethers.constants.AddressZero;

describe("Device Binding", function () {
  before(async function () {
    [_, user, badGuy, user_2] = await hre.ethers.getSigners();
  });
  describe("Initialization", function () {
    it("Should initialize the contract with Device Registry", async function () {
      const DevicesRegistry = await hre.ethers.getContractFactory(
        "DevicesRegistry"
      );
      const devicesRegistry = await DevicesRegistry.deploy();
      await devicesRegistry.deployed();

      const DeviceBinding = await hre.ethers.getContractFactory(
        "DeviceBinding"
      );
      const deviceBinding = await DeviceBinding.deploy(devicesRegistry.address);
      await deviceBinding.deployed();
      expect(await deviceBinding.devicesRegistry()).to.equal(
        devicesRegistry.address
      );
    });
  });
  describe("Binding", function () {
    beforeEach(async function () {
      const DevicesRegistry = await hre.ethers.getContractFactory(
        "DevicesRegistry"
      );
      devicesRegistry = await DevicesRegistry.deploy();
      await devicesRegistry.deployed();

      const DeviceBinding = await hre.ethers.getContractFactory(
        "DeviceBinding"
      );
      deviceBinding = await DeviceBinding.deploy(devicesRegistry.address);
      await deviceBinding.deployed();
    });
    it("Should bind a device", async function () {
      await devicesRegistry.registerDevice(DEVICE_ID_1);
      await deviceBinding.bindDevice(DEVICE_ID_1, user.address);
      expect(await deviceBinding.getDeviceOwner(DEVICE_ID_1)).to.equal(
        user.address
      );
      expect(await deviceBinding.getDevicesCount()).to.equal(1);
      expect(await deviceBinding.getOwnedDevices(user.address)).to.eql([
        DEVICE_ID_1,
      ]);
    });
    it("Should bind multiple devices", async function () {
      await devicesRegistry.registerDevice(DEVICE_ID_1);
      await devicesRegistry.registerDevice(DEVICE_ID_2);
      await deviceBinding.bindDevice(DEVICE_ID_1, user.address);
      await deviceBinding.bindDevice(DEVICE_ID_2, user.address);
      expect(await deviceBinding.getDeviceOwner(DEVICE_ID_1)).to.equal(
        user.address
      );
      expect(await deviceBinding.getDeviceOwner(DEVICE_ID_2)).to.equal(
        user.address
      );
      expect(await deviceBinding.getDevicesCount()).to.equal(2);
      expect(await deviceBinding.getOwnedDevices(user.address)).to.eql([
        DEVICE_ID_1,
        DEVICE_ID_2,
      ]);
    });
    it("Should bind multiple devices to multiple users", async function () {
      await devicesRegistry.registerDevice(DEVICE_ID_1);
      await devicesRegistry.registerDevice(DEVICE_ID_2);
      await devicesRegistry.registerDevice(DEVICE_ID_3);

      await deviceBinding.bindDevice(DEVICE_ID_1, user.address);
      await deviceBinding.bindDevice(DEVICE_ID_2, user_2.address);
      await deviceBinding.bindDevice(DEVICE_ID_3, user.address);

      expect(await deviceBinding.getDeviceOwner(DEVICE_ID_1)).to.equal(
        user.address
      );
      expect(await deviceBinding.getDeviceOwner(DEVICE_ID_2)).to.equal(
        user_2.address
      );
      expect(await deviceBinding.getDeviceOwner(DEVICE_ID_3)).to.equal(
        user.address
      );
      expect(await deviceBinding.getDevicesCount()).to.equal(3);
      expect(await deviceBinding.getOwnedDevices(user.address)).to.eql([
        DEVICE_ID_1,
        DEVICE_ID_3,
      ]);
      expect(await deviceBinding.getOwnedDevices(user_2.address)).to.eql([
        DEVICE_ID_2,
      ]);
    });
    it("Should emit an event when binding a device", async function () {
      await devicesRegistry.registerDevice(DEVICE_ID_1);
      await expect(deviceBinding.bindDevice(DEVICE_ID_1, user.address))
        .to.emit(deviceBinding, "OwnershipAssigned")
        .withArgs(DEVICE_ID_1, user.address);
    });
    it("Should not bind a device if it is already bound", async function () {
      await devicesRegistry.registerDevice(DEVICE_ID_1);
      await deviceBinding.bindDevice(DEVICE_ID_1, user.address);
      await expect(
        deviceBinding.bindDevice(DEVICE_ID_1, user.address)
      ).to.be.revertedWith("device has already been bound");
    });
    it("Should not bind a device if it is not authorized", async function () {
      await expect(
        deviceBinding.bindDevice(DEVICE_ID_1, user.address)
      ).to.be.revertedWith("Data Source is not registered");
    });
    it("Should not bind a device if it was suspended", async function () {
      await devicesRegistry.registerDevice(DEVICE_ID_1);
      await devicesRegistry.suspendDevice(DEVICE_ID_1);
      await expect(
        deviceBinding.bindDevice(DEVICE_ID_1, user.address)
      ).to.be.revertedWith("Data Source is suspended");
    });
  });
  describe("Unbinding", function () {
    beforeEach(async function () {
      const DevicesRegistry = await hre.ethers.getContractFactory(
        "DevicesRegistry"
      );
      devicesRegistry = await DevicesRegistry.deploy();
      await devicesRegistry.deployed();

      const DeviceBinding = await hre.ethers.getContractFactory(
        "DeviceBinding"
      );
      deviceBinding = await DeviceBinding.deploy(devicesRegistry.address);
      await deviceBinding.deployed();

      await devicesRegistry.registerDevice(DEVICE_ID_1);
      await deviceBinding.bindDevice(DEVICE_ID_1, user.address);
    });
    it("Should unbind a device", async function () {
      await deviceBinding.unbindDevice(DEVICE_ID_1);
      expect(await deviceBinding.getDeviceOwner(DEVICE_ID_1)).to.equal(
        ZERO_ADDR
      );
      expect(await deviceBinding.getDevicesCount()).to.equal(0);
      expect(await deviceBinding.getOwnedDevices(user.address)).to.eql([]);
    });
    it("Should unbind multiple devices", async function () {
      await devicesRegistry.registerDevice(DEVICE_ID_2);
      await deviceBinding.bindDevice(DEVICE_ID_2, user.address);
      await deviceBinding.unbindDevice(DEVICE_ID_1);
      await deviceBinding.unbindDevice(DEVICE_ID_2);
      expect(await deviceBinding.getDeviceOwner(DEVICE_ID_1)).to.equal(
        ZERO_ADDR
      );
    });
    it("Should emit an event when unbinding a device", async function () {
      await expect(deviceBinding.unbindDevice(DEVICE_ID_1))
        .to.emit(deviceBinding, "OwnershipRenounced")
        .withArgs(DEVICE_ID_1);
    });
    it("Should not unbind a device if it is not bound", async function () {
      await expect(deviceBinding.unbindDevice(DEVICE_ID_2)).to.be.revertedWith(
        "device is not bound"
      );
    });
    it("Should not unbind a device if it is already unbound", async function () {
      await deviceBinding.unbindDevice(DEVICE_ID_1);
      await expect(deviceBinding.unbindDevice(DEVICE_ID_1)).to.be.revertedWith(
        "device is not bound"
      );
    });
    it("Should not unbind a device if it is not owned by the sender", async function () {
      await expect(
        deviceBinding.connect(badGuy).unbindDevice(DEVICE_ID_1)
      ).to.be.revertedWith("not the device owner or admin");
    });
  });
});
