require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const prepmeBadgesNFTContract = await ethers.getContractAt(
    "PrepMeBadges",
    "0x054e90A623003AF69B46B18b224FAf204835E210"
  );

  const user = "0x4737fa61025319c9525bD3e1bFfC0b0F538c4D7F";

  /**
   * Welcome NFT: 1
   * First Exam NFT: 2
   */
  const badgeId = 1;

  //Check if wallet already has the badge
  const badge = await prepmeBadgesNFTContract.balanceOf(user, badgeId);

  if (badge == 0) {
    const tx = await prepmeBadgesNFTContract.mintBadge(
      user, //to
      badgeId, //badgeId
      1, //amount
      ethers.toBeHex(0, 32) //data
    );

    console.log(tx);
  }
}

main();

//npx hardhat run scripts/mint-nfts-example.js --network opencampus
