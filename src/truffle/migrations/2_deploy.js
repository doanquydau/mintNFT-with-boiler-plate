const DauDQCoin = artifacts.require("DauDQCoin");

module.exports = async(deployer) => {
  await deployer.deploy(DauDQCoin);
};