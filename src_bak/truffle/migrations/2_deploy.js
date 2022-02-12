const DauDQCoin = artifacts.require("DauDQCoin");
const NFTMarket = artifacts.require("NFTMarket");

module.exports = async(deployer) => {
  await deployer.deploy(DauDQCoin);
  // await deployer.deploy(NFTMarket);

  await deployer.deploy(NFTMarket).then(function(instance) {
    let b = instance;
    b.initialize(DauDQCoin.address);
  });
};