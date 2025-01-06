require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const prepmeBadgesNFTContract = await ethers.getContractAt(
    "PrepMeBadges",
    "0x054e90A623003AF69B46B18b224FAf204835E210"
  );

  const user = "0x4737fa61025319c9525bD3e1bFfC0b0F538c4D7F";

  const badges = await prepmeBadgesNFTContract.getBadgesByOwner(user);

  console.log(badges);
}

main();

//npx hardhat run scripts/get-wallet-nfts.js --network opencampus
