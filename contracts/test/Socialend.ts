import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import {
  getProof,
  getRoot,
  prepareWorldID,
  registerIdentity,
  registerInvalidIdentity,
  setUpWorldID,
} from "./helpers/InteractsWithWorldID";

const { parseEther } = ethers.utils;
const APP_ID = "app_1234";
const ACTION = "wid_test_1234";

describe("Socialend", function () {
  let socialend: Contract;
  let usdc: Contract;
  let owner: any, addr1: any, addr2: any, addr3: any;
  const interestRate = 20;

  this.beforeAll(async () => {
    await prepareWorldID();
  });

  beforeEach(async () => {
    const worldIDAddress = await setUpWorldID();
    // Deploy mock USDC token
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    usdc = await ERC20Mock.deploy();

    const Socialend = await ethers.getContractFactory("Socialend");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    socialend = await Socialend.deploy(
      usdc.address,
      interestRate,
      worldIDAddress,
      APP_ID,
      ACTION
    );

    // Mint some USDC for testing purposes
    await usdc.mint(owner.address, parseEther("1000000"));
    await usdc.mint(addr1.address, parseEther("1000000"));
    await usdc.mint(addr2.address, parseEther("1000000"));
    await usdc.mint(addr3.address, parseEther("1000000"));
  });

  it("Should create a loan request", async () => {
    await registerIdentity();
    await usdc.connect(addr3).approve(socialend.address, parseEther("10000"));
    await usdc.connect(addr3).transfer(socialend.address, parseEther("10000"));
    await usdc.connect(addr1).approve(socialend.address, parseEther("10000"));
    const [nullifierHash, proof] = await getProof(
      APP_ID,
      ACTION,
      addr1.address
    );
    await socialend
      .connect(addr1)
      .createLoanRequest(
        parseEther("2000"),
        parseEther("1000"),
        parseEther("0.1"),
        1700000000,
        await getRoot(),
        nullifierHash,
        proof
      );
    const loanRequest = await socialend.loanRequests(1);
    expect(loanRequest.borrower).to.equal(addr1.address);
    expect(loanRequest.amount).to.equal(parseEther("2000"));
    expect(loanRequest.collateral).to.equal(parseEther("1000"));
    expect(loanRequest.interest).to.equal(parseEther("0.1"));
    expect(loanRequest.dueDate).to.equal(1700000000);
  });

  // Other tests go here
  it("Should fund a loan request", async () => {
    await registerIdentity();
    const [nullifierHash, proof] = await getProof(
      APP_ID,
      ACTION,
      addr1.address
    );
    await usdc.connect(addr3).approve(socialend.address, parseEther("10000"));
    await usdc.connect(addr3).transfer(socialend.address, parseEther("10000"));
    await usdc.connect(addr1).approve(socialend.address, parseEther("10000"));
    await socialend
      .connect(addr1)
      .createLoanRequest(
        parseEther("3000"),
        parseEther("2000"),
        parseEther("0.1"),
        1700000000,
        await getRoot(),
        nullifierHash,
        proof
      );

    await usdc.connect(addr2).approve(socialend.address, parseEther("3000"));
    await socialend.connect(addr2).fundLoanRequest(1);

    const loanRequest = await socialend.loanRequests(1);
    expect(loanRequest.isFunded).to.equal(true);
  });

  it("Should repay the loan", async () => {
    await registerIdentity();
    const [nullifierHash, proof] = await getProof(
      APP_ID,
      ACTION,
      addr1.address
    );
    await usdc.connect(addr3).approve(socialend.address, parseEther("10000"));
    await usdc.connect(addr3).transfer(socialend.address, parseEther("10000"));
    await usdc.connect(addr1).approve(socialend.address, parseEther("10000"));
    await socialend
      .connect(addr1)
      .createLoanRequest(
        parseEther("3000"),
        parseEther("2000"),
        parseEther("0.1"),
        1700000000,
        await getRoot(),
        nullifierHash,
        proof
      );

    console.log("hey");
    const AloanRequest = await socialend.loanRequests(1);
    console.log(AloanRequest);
    await usdc.connect(addr2).approve(socialend.address, parseEther("10000"));
    await socialend.connect(addr2).fundLoanRequest(1);
    console.log("hey");

    await ethers.provider.send("evm_increaseTime", [31536000]);
    await ethers.provider.send("evm_mine", []); // ブロックをマイニング

    await usdc.connect(addr1).approve(socialend.address, parseEther("10000"));
    console.log("hey");
    const balance = await usdc.balanceOf(socialend.address);
    console.log(balance);
    await socialend.connect(addr1).repayLoan(1, parseEther("3000"));

    const loanRequest = await socialend.loanRequests(1);
    console.log(loanRequest);

    expect(loanRequest.remainingAmount).to.equal(parseEther("600"));
    expect(loanRequest.isExecuted).to.equal(true);
  });

  it("Should liquidate collateral after deadline", async () => {
    await registerIdentity();
    const [nullifierHash, proof] = await getProof(
      APP_ID,
      ACTION,
      addr1.address
    );
    await usdc.connect(addr3).approve(socialend.address, parseEther("10000"));
    await usdc.connect(addr3).transfer(socialend.address, parseEther("10000"));
    await usdc.connect(addr1).approve(socialend.address, parseEther("10000"));
    const currentTime = (await ethers.provider.getBlock("latest")).timestamp;
    const deadline = currentTime + 100;

    await socialend
      .connect(addr1)
      .createLoanRequest(
        parseEther("3000"),
        parseEther("2000"),
        parseEther("0.1"),
        deadline,
        await getRoot(),
        nullifierHash,
        proof
      );

    await usdc.connect(addr2).approve(socialend.address, parseEther("3000"));
    await socialend.connect(addr2).fundLoanRequest(1);

    await ethers.provider.send("evm_increaseTime", [200]); // タイムスタンプを200秒進める
    await ethers.provider.send("evm_mine", []); // ブロックをマイニング

    await socialend.connect(addr2).liquidateCollateral(1);

    const loanRequest = await socialend.loanRequests(1);
    expect(loanRequest.isExecuted).to.equal(true);
  });

  it("calculates interest correctly", async () => {
    await registerIdentity();
    const [nullifierHash, proof] = await getProof(
      APP_ID,
      ACTION,
      addr1.address
    );
    await usdc.connect(addr3).approve(socialend.address, parseEther("10000"));
    await usdc.connect(addr3).transfer(socialend.address, parseEther("10000"));
    await usdc.connect(addr1).approve(socialend.address, parseEther("10000"));
    const currentTime = (await ethers.provider.getBlock("latest")).timestamp;
    const deadline = currentTime + 100;
    const requestId = 1;

    await socialend
      .connect(addr1)
      .createLoanRequest(
        parseEther("3000"),
        parseEther("2000"),
        parseEther("0.1"),
        deadline,
        await getRoot(),
        nullifierHash,
        proof
      );

    await usdc.connect(addr2).approve(socialend.address, parseEther("3000"));
    await socialend.connect(addr2).fundLoanRequest(requestId);

    // 3. Mine blocks to simulate the passage of time
    // Replace the number 10 with the number of seconds you want to simulate
    await ethers.provider.send("evm_increaseTime", [31536000]);
    await ethers.provider.send("evm_mine", []);

    // 4. Call the getRemainingAmount function
    const remainingAmount = await socialend.getRemainingAmount(requestId);

    // 5. Check if the calculated interest is correct
    // Replace expectedRemainingAmount with the expected value
    expect(remainingAmount).to.equal(parseEther("3600"));
  });
});
