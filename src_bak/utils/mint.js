// import { artifacts } from "truffle";

const NFT = artifacts.require("NFT");

module.exports = async function () {
  const nft = await NFT.deployed();

  try {
    await nft.mint(
      "https://bafybeih2uozfrjotubth3wuw44fz6x2y6qnmzrsyyuhq4pjctwz43pq634.ipfs.infura-ipfs.io/",
      "100000000000000000"
    );
    console.log("minted your NFT");
  } catch (e) {
    console.log("Failed to mint ", e);
  }

  return;
};
