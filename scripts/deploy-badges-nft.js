require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const PrepMeBadges = await ethers.getContractFactory("PrepMeBadges");
  const badgeContract = await PrepMeBadges.deploy(
    "https://ik.imagekit.io/prepme/badge-nft-metadata/"
  );

  await badgeContract.waitForDeployment();

  const contractAddress = await badgeContract.getAddress();

  console.log("BadgeNFT Contract deployed to: ", contractAddress);
}

main();

//npx hardhat run scripts/deploy-badge-nft.js --network opencampus

//Contract deployed to:  0x054e90A623003AF69B46B18b224FAf204835E210

//npx hardhat verify --network opencampus 0x054e90A623003AF69B46B18b224FAf204835E210 "https://ik.imagekit.io/prepme/badge-nft-metadata/"
//https://edu-chain-testnet.blockscout.com/address/0x054e90A623003AF69B46B18b224FAf204835E210#code
