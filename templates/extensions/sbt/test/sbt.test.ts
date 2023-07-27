import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { DEVICE_ID_1, DEVICE_ID_2, URI_EXAMPLE, SBT_CONTRACT_NAME, SBT_CONTRACT_SYMBOL } from "./fixtures";
import { DeviceSBT } from "../typechain-types";

async function setup() {
  const sbt = await ethers.getContractFactory("DeviceSBT");
  const sbtInstance = await sbt.deploy(
    URI_EXAMPLE,
    SBT_CONTRACT_NAME,
    SBT_CONTRACT_SYMBOL
  );
  await sbtInstance.deployed();

  const contracts = {
    DeviceSBT: sbtInstance as DeviceSBT,
  };

  return {
    ...contracts,
  };
}

async function grantMinterRole(sbt: DeviceSBT, minter: SignerWithAddress) {
  const minterRole = await sbt.MINTER_ROLE();
  await sbt.grantRole(minterRole, minter.address);
}

describe("DeviceSBT", function () {
  let [admin, user, badGuy, minter]: SignerWithAddress[] = [];
  let sbt: DeviceSBT;
  before(async function () {
    [admin, user, badGuy, minter] = await ethers.getSigners();
  });
  beforeEach(async function () {
    const { DeviceSBT } = await setup();
    sbt = DeviceSBT;
    await grantMinterRole(sbt, minter);
  });
  it("Should deploy DeviceSBT", async function () {
    expect(await sbt.name()).to.equal(SBT_CONTRACT_NAME);
    expect(await sbt.symbol()).to.equal(SBT_CONTRACT_SYMBOL);
  });
  it("Minter should be able to mint one token to a user", async function () {
    await sbt.connect(minter).safeMint(user.address, DEVICE_ID_1);

    expect(await sbt.balanceOf(user.address)).to.equal(1);
    expect(await sbt.ownerOf(DEVICE_ID_1)).to.equal(user.address);
    expect(await sbt.tokenURI(DEVICE_ID_1)).to.equal(URI_EXAMPLE);
  });
  it("Minter should be able to mint multiple tokens to a user", async function () {
    await sbt.connect(minter).safeMint(user.address, DEVICE_ID_1);
    await sbt.connect(minter).safeMint(user.address, DEVICE_ID_2);

    expect(await sbt.balanceOf(user.address)).to.equal(2);
  });
  it("User should not be able to transfer SBT to another user", async function () {
    await sbt.connect(minter).safeMint(user.address, DEVICE_ID_1);

    await expect(
      sbt.connect(user).transferFrom(user.address, badGuy.address, DEVICE_ID_1)
    ).to.be.revertedWith("DeviceSBT: Only minting allowed");
  });
  it("Minter cannot mint a token with an already used sbt id", async function () {
    await sbt.connect(minter).safeMint(user.address, DEVICE_ID_1);

    await expect(
      sbt.connect(minter).safeMint(user.address, DEVICE_ID_1)
    ).to.be.revertedWith("ERC721: token already minted");
  });
  it("Minter can approve a user to mint a sbt", async function () {
    await sbt.connect(minter).approveSBT(user.address, DEVICE_ID_1);
    expect(await sbt.sbtApprovals(DEVICE_ID_1)).to.equal(user.address);
  });
  it("Should throw if user tries to approve a sbt", async function () {
    await expect(sbt.connect(badGuy).approveSBT(badGuy.address, DEVICE_ID_1)).to
      .be.reverted;
  });
  it("User can mint a sbt if approved", async function () {
    await sbt.connect(minter).approveSBT(user.address, DEVICE_ID_1);
    await sbt.connect(user).mintSBT(DEVICE_ID_1);

    expect(await sbt.balanceOf(user.address)).to.equal(1);
    expect(await sbt.ownerOf(DEVICE_ID_1)).to.equal(user.address);
    expect(await sbt.tokenURI(DEVICE_ID_1)).to.equal(URI_EXAMPLE);
  });
  it("User cannot mint a sbt if not approved", async function () {
    await expect(sbt.connect(user).mintSBT(DEVICE_ID_1)).to.be.revertedWith(
      "ERC721: mint to the zero address"
    );
  });
  it("User cannot mint a sbt if already minted", async function () {
    await sbt.connect(minter).approveSBT(user.address, DEVICE_ID_1);
    await sbt.connect(user).mintSBT(DEVICE_ID_1);

    await expect(sbt.connect(user).mintSBT(DEVICE_ID_1)).to.be.revertedWith(
      "ERC721: token already minted"
    );
  });
  it("Minter cannot mint a sbt if already minted by user", async function () {
    await sbt.connect(minter).approveSBT(user.address, DEVICE_ID_1);
    await sbt.connect(user).mintSBT(DEVICE_ID_1);

    await expect(
      sbt.connect(minter).safeMint(user.address, DEVICE_ID_1)
    ).to.be.revertedWith("ERC721: token already minted");
  });
  it("admin can update uri", async function () {
    await sbt.connect(admin).setURI(URI_EXAMPLE + "2");
    await sbt.connect(minter).safeMint(user.address, DEVICE_ID_1);
    expect(await sbt.tokenURI(DEVICE_ID_1)).to.equal(URI_EXAMPLE + "2");
  });
});
