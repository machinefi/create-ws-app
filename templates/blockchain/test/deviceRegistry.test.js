const { expect } = require("chai");

describe("Device Registry", function () {
  it("Should deploy Device Registry", async function () {
    const DevicesRegistry = await ethers.getContractFactory("DevicesRegistry");
    const registry = await DevicesRegistry.deploy();
    await registry.deployed();

    expect(registry.address).to.not.equal(0);
  });
});
