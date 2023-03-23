const JamToken = artifacts.require("JamToken");
const StellarToken = artifacts.require('StellartToken');
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(JamToken);
  const jamToken = await JamToken.deployed();
  
  await deployer.deploy(StellarToken);
  const stellarToken = await StellarToken.deployed();

  await deployer.deploy(TokenFarm, stellarToken.address, jamToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // Transferir tokens StellarToken (token de recompensa) a TokenFarm (1 millon de tokens)
  await stellarToken.transfer(tokenFarm.address, '1000000000000000000000000');

  // Transferencia de los tokens para el Staking
  // await jamToken.transfer(accounts[1], '100000000000000000000');
};
