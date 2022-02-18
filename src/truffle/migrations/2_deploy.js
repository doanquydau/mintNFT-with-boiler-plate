const DauDQNFT = artifacts.require("DauDQNFT");
const NFTMarket = artifacts.require("NFTMarket");

module.exports = async(deployer) => {
  // await deployer.deploy(DauDQNFT);
  // await deployer.deploy(NFTMarket);

  // await deployer.deploy(NFTMarket).then(function(instance) {
  //   let b = instance;
  //   b.initialize(DauDQNFT.address);
  // });
  
  await deployer.deploy(NFTMarket);
  await deployer.deploy(DauDQNFT, NFTMarket.address);
};