const { expect } = require("chai");

describe("NFT", function () {
  it("Should deploy NFT", async function () {
    const NFT = await ethers.getContractFactory("ExampleTokenERC721");
    const nft = await NFT.deploy();
    await nft.deployed();

    expect(await nft.name()).to.equal("W3BStreamNFT");
    expect(await nft.symbol()).to.equal("W3BNFT");
  });
});
