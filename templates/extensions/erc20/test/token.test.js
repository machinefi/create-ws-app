const { expect } = require("chai");

describe("Token", function () {
  it("Should deploy Token", async function () {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.deployed();

    expect(await token.name()).to.equal("Token");
    expect(await token.symbol()).to.equal("TOC");
  });
});
