import hardhat, { ethers } from "hardhat";

async function main() {
  const USDCTokenAddress = "0xE097d6B3100777DC31B34dC2c58fB524C2e76921";
  const interestRate = 20;
  const worldIDAddress = "0xABB70f7F39035586Da57B3c8136035f87AC0d2Aa";
  const APP_ID = "app_staging_7822955fc8648ea2c6dc374ae4decf2c";
  const ACTION = "";

  // const deployer:any = "0x3584ba4C558A5ff7cb153a355d892Cd20D0A6206";
  const accounts = await hardhat.ethers.getSigners();
  const [deployer] = accounts;
  console.log(deployer);

  const socialend = await hardhat.mbDeployer.deploy(
    deployer,
    "Socialend",
    [USDCTokenAddress, interestRate, worldIDAddress, APP_ID, ACTION],
    {
      addressLabel: "socialend5",
      contractLabel: "socialend5",
    }
  );

  // const Socialend = await ethers.getContractFactory("Socialend");
  // const socialend = await Socialend.deploy(
  //   USDCTokenAddress,
  //   interestRate,
  //   worldIDAddress,
  //   APP_ID,
  //   ACTION
  // );

  // await socialend.deployed();

  console.log(`Deployed SpriteWrite.sol to ${socialend.mbAddress.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
