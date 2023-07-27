import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { DeviceRewards } from "../typechain-types";
import { REWARDS_CONTRACT_NAME } from "./fixtures";

const TIER_1_URI =
  "ipfs://QmQr1X5o4Jhdeb6BMviYN5anHMCjeMHxQPcu45YpN8SfQD/{id}.json";

const TIER_1_ID = 0;

async function setup() {
  const rewards = await ethers.getContractFactory("DeviceRewards");
  const rewardsInstance = await rewards.deploy(
    TIER_1_URI,
    REWARDS_CONTRACT_NAME
  );
  await rewardsInstance.deployed();

  const contracts = {
    DeviceRewards: rewardsInstance as DeviceRewards,
  };

  return {
    ...contracts,
  };
}

async function grantMinterRole(
  rewards: DeviceRewards,
  minter: SignerWithAddress
) {
  const minterRole = await rewards.MINTER_ROLE();
  await rewards.grantRole(minterRole, minter.address);
}

describe("DeviceRewards", function () {
  let [admin, user, badGuy, minter, uriSetter]: SignerWithAddress[] = [];
  let rewards: DeviceRewards;
  before(async function () {
    [admin, user, badGuy, minter, uriSetter] = await ethers.getSigners();
  });
  beforeEach(async function () {
    const { DeviceRewards } = await setup();
    rewards = DeviceRewards;
    await grantMinterRole(rewards, minter);
  });
  it("Should deploy DeviceRewards", async function () {
    expect(rewards.address).to.not.equal(0);
    expect(await rewards.name()).to.equal(REWARDS_CONTRACT_NAME);
  });
  it("Should initialize with an uri", async function () {
    expect(await rewards.uri(TIER_1_ID)).to.equal(TIER_1_URI);
  });
  it("Uri setter should set token uri", async function () {
    const uriSetterRole = await rewards.URI_SETTER_ROLE();
    await rewards.grantRole(uriSetterRole, uriSetter.address);

    await rewards.connect(uriSetter).setURI(TIER_1_URI + "2");

    expect(await rewards.uri(TIER_1_ID)).to.equal(TIER_1_URI + "2");
  });
  it("Minter should be able to mint one token to a user", async function () {
    await rewards.connect(minter).mint(user.address, TIER_1_ID, 1, []);
    expect(await rewards.balanceOf(user.address, TIER_1_ID)).to.equal(1);
  });
  it("Minter should be able to mint multiple tokens to a user", async function () {
    await rewards.connect(minter).mint(user.address, TIER_1_ID, 2, []);
    expect(await rewards.balanceOf(user.address, TIER_1_ID)).to.equal(2);
  });
  it("Minter should be able to approve a user to mint token of a tier", async function () {
    await rewards.connect(minter).approve(user.address, TIER_1_ID, 1);
    expect(await rewards.allowance(TIER_1_ID, user.address)).to.equal(1);
  });
  it("Minter should be able to approve a user to mint multiple tokens of a tier", async function () {
    await rewards.connect(minter).approve(user.address, TIER_1_ID, 2);
    expect(await rewards.allowance(TIER_1_ID, user.address)).to.equal(2);
  });
  it("Minter should be able to approve a user to mint token of a tier multiple times", async function () {
    await rewards.connect(minter).approve(user.address, TIER_1_ID, 1);
    await rewards.connect(minter).approve(user.address, TIER_1_ID, 2);
    expect(await rewards.allowance(TIER_1_ID, user.address)).to.equal(3);
  });
  it("User cannot set allowance", async function () {
    await expect(rewards.connect(user).approve(user.address, TIER_1_ID, 1)).to
      .be.reverted;
  });
  it("User should be able to mint a token of a tier", async function () {
    await rewards.connect(minter).approve(user.address, TIER_1_ID, 1);
    await rewards.connect(user).mintFromAllowance(TIER_1_ID, []);
    expect(await rewards.balanceOf(user.address, TIER_1_ID)).to.equal(1);
    expect(await rewards.allowance(TIER_1_ID, user.address)).to.equal(0);
  });
});
