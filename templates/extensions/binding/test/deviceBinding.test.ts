import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { DeviceBinding, DeviceRegistry } from "../typechain-types";
import { DEVICE_ID_1, DEVICE_ID_2, DEVICE_ID_3 } from "./fixtures";

const ZERO_ADDR = ethers.constants.AddressZero;

async function setup() {
  const deviceRegistry = await ethers.getContractFactory("DeviceRegistry");
  const deviceRegistryInstance = await deviceRegistry.deploy();
  await deviceRegistryInstance.deployed();

  const DeviceBinding = await ethers.getContractFactory("DeviceBinding");
  const deviceBindingInstance = await DeviceBinding.deploy(
    deviceRegistryInstance.address,
  );
  await deviceBindingInstance.deployed();

  const contracts = {
    DeviceRegistry: deviceRegistryInstance as DeviceRegistry,
    DeviceBinding: deviceBindingInstance as DeviceBinding,
  };

  return {
    ...contracts,
  };
}

describe("Device Binding", function () {
  let [_, user, badGuy, user_2]: SignerWithAddress[] = [];

  before(async function () {
    [_, user, badGuy, user_2] = await ethers.getSigners();
  });

  describe("Initialization", function () {
    it("Should initialize the contract with Device Registry", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      expect(await DeviceBinding.deviceRegistry()).to.equal(
        DeviceRegistry.address,
      );
    });
  });
  describe("Binding", function () {
    it("Should bind a device", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await DeviceBinding.bindDevice(DEVICE_ID_1, user.address);
      expect(await DeviceBinding.getDeviceOwner(DEVICE_ID_1)).to.equal(
        user.address,
      );
      expect(await DeviceBinding.getDevicesCount()).to.equal(1);
      expect(await DeviceBinding.getOwnedDevices(user.address)).to.eql([
        DEVICE_ID_1,
      ]);
    });
    it("Should bind multiple devices", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await DeviceRegistry.registerDevice(DEVICE_ID_2);
      await DeviceBinding.bindDevice(DEVICE_ID_1, user.address);
      await DeviceBinding.bindDevice(DEVICE_ID_2, user.address);
      expect(await DeviceBinding.getDeviceOwner(DEVICE_ID_1)).to.equal(
        user.address,
      );
      expect(await DeviceBinding.getDeviceOwner(DEVICE_ID_2)).to.equal(
        user.address,
      );
      expect(await DeviceBinding.getDevicesCount()).to.equal(2);
      expect(await DeviceBinding.getOwnedDevices(user.address)).to.eql([
        DEVICE_ID_1,
        DEVICE_ID_2,
      ]);
    });
    it("Should bind multiple devices to multiple users", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await DeviceRegistry.registerDevice(DEVICE_ID_2);
      await DeviceRegistry.registerDevice(DEVICE_ID_3);

      await DeviceBinding.bindDevice(DEVICE_ID_1, user.address);
      await DeviceBinding.bindDevice(DEVICE_ID_2, user_2.address);
      await DeviceBinding.bindDevice(DEVICE_ID_3, user.address);

      expect(await DeviceBinding.getDeviceOwner(DEVICE_ID_1)).to.equal(
        user.address,
      );
      expect(await DeviceBinding.getDeviceOwner(DEVICE_ID_2)).to.equal(
        user_2.address,
      );
      expect(await DeviceBinding.getDeviceOwner(DEVICE_ID_3)).to.equal(
        user.address,
      );
      expect(await DeviceBinding.getDevicesCount()).to.equal(3);
      expect(await DeviceBinding.getOwnedDevices(user.address)).to.eql([
        DEVICE_ID_1,
        DEVICE_ID_3,
      ]);
      expect(await DeviceBinding.getOwnedDevices(user_2.address)).to.eql([
        DEVICE_ID_2,
      ]);
    });
    it("Should emit an event when binding a device", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await expect(DeviceBinding.bindDevice(DEVICE_ID_1, user.address))
        .to.emit(DeviceBinding, "OwnershipAssigned")
        .withArgs(DEVICE_ID_1, user.address);
    });
    it("Should not bind a device if it is already bound", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await DeviceBinding.bindDevice(DEVICE_ID_1, user.address);
      await expect(
        DeviceBinding.bindDevice(DEVICE_ID_1, user.address),
      ).to.be.revertedWith("device has already been bound");
    });
    it("Should not bind a device if it is not authorized", async function () {
      const { DeviceBinding } = await setup();
      await expect(
        DeviceBinding.bindDevice(DEVICE_ID_1, user.address),
      ).to.be.revertedWith("device is not authorized");
    });
    it("Should not bind a device if it was suspended", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await DeviceRegistry.suspendDevice(DEVICE_ID_1);
      await expect(
        DeviceBinding.bindDevice(DEVICE_ID_1, user.address),
      ).to.be.revertedWith("device is not authorized");
    });
    it("Should bind devices in batches", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevices([DEVICE_ID_1, DEVICE_ID_2]);

      await DeviceBinding.bindDevices([DEVICE_ID_1, DEVICE_ID_2], user.address);

      expect(await DeviceBinding.getDeviceOwner(DEVICE_ID_1)).to.equal(
        user.address,
      );
      expect(await DeviceBinding.getDeviceOwner(DEVICE_ID_2)).to.equal(
        user.address,
      );
    });
    it("Should emit events when binding devices in batches", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevices([DEVICE_ID_1, DEVICE_ID_2]);

      await expect(
        DeviceBinding.bindDevices([DEVICE_ID_1, DEVICE_ID_2], user.address),
      )
        .to.emit(DeviceBinding, "OwnershipAssigned")
        .withArgs(DEVICE_ID_1, user.address)
        .to.emit(DeviceBinding, "OwnershipAssigned")
        .withArgs(DEVICE_ID_2, user.address);
    });
    it("Should not bind devices in batches if they are already bound", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevices([DEVICE_ID_1, DEVICE_ID_2]);
      await DeviceBinding.bindDevice(DEVICE_ID_2, user.address);
      await expect(
        DeviceBinding.bindDevices([DEVICE_ID_1, DEVICE_ID_2], user.address),
      ).to.be.revertedWith("device has already been bound");
    });
    it("Should not bind devices in batches if they are not authorized", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevices([DEVICE_ID_1]);
      await expect(
        DeviceBinding.bindDevices([DEVICE_ID_1, DEVICE_ID_2], user.address),
      ).to.be.revertedWith("device is not authorized");
    });
  });
  describe("Unbinding", function () {
    it("Should unbind a device", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await DeviceBinding.bindDevice(DEVICE_ID_1, user.address);

      await DeviceBinding.unbindDevice(DEVICE_ID_1);
      expect(await DeviceBinding.getDeviceOwner(DEVICE_ID_1)).to.equal(
        ZERO_ADDR,
      );
      expect(await DeviceBinding.getDevicesCount()).to.equal(0);
      expect(await DeviceBinding.getOwnedDevices(user.address)).to.eql([]);
    });
    it("Should unbind multiple devices", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await DeviceBinding.bindDevice(DEVICE_ID_1, user.address);

      await DeviceRegistry.registerDevice(DEVICE_ID_2);
      await DeviceBinding.bindDevice(DEVICE_ID_2, user.address);
      await DeviceBinding.unbindDevice(DEVICE_ID_1);
      await DeviceBinding.unbindDevice(DEVICE_ID_2);
      expect(await DeviceBinding.getDeviceOwner(DEVICE_ID_1)).to.equal(
        ZERO_ADDR,
      );
    });
    it("Should emit an event when unbinding a device", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await DeviceBinding.bindDevice(DEVICE_ID_1, user.address);

      await expect(DeviceBinding.unbindDevice(DEVICE_ID_1))
        .to.emit(DeviceBinding, "OwnershipRenounced")
        .withArgs(DEVICE_ID_1);
    });
    it("Should not unbind a device if it is not bound", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await DeviceBinding.bindDevice(DEVICE_ID_1, user.address);

      await expect(DeviceBinding.unbindDevice(DEVICE_ID_2)).to.be.revertedWith(
        "device is not bound",
      );
    });
    it("Should not unbind a device if it is already unbound", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await DeviceBinding.bindDevice(DEVICE_ID_1, user.address);

      await DeviceBinding.unbindDevice(DEVICE_ID_1);
      await expect(DeviceBinding.unbindDevice(DEVICE_ID_1)).to.be.revertedWith(
        "device is not bound",
      );
    });
    it("Should not unbind a device if it is not owned by the sender", async function () {
      const { DeviceBinding, DeviceRegistry } = await setup();
      await DeviceRegistry.registerDevice(DEVICE_ID_1);
      await DeviceBinding.bindDevice(DEVICE_ID_1, user.address);

      await expect(
        DeviceBinding.connect(badGuy).unbindDevice(DEVICE_ID_1),
      ).to.be.revertedWith("not the device owner or admin");
    });
  });
});
