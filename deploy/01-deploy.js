const { network } = require("hardhat");
const { developmentChain } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

// Sepolia addresses
const WETH_USD_PRICE_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
const WBTC_USD_PRICE_FEED = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43";
const DSC_ADDRESS = "0x04ce3AED3189d84d0F1E675C3A31E28EE87B376A";
const WETH = "0xdd13E55209Fd76AfE204dBda4007C227904f0a81";
const WBTC = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying DSCEngine...");

  const tokenAddresses = [WETH, WBTC];
  const priceFeedAddresses = [WETH_USD_PRICE_FEED, WBTC_USD_PRICE_FEED];
  const args = [tokenAddresses, priceFeedAddresses, DSC_ADDRESS];

  const dscEngine = await deploy("DSCEngine", {
    contract: "contracts/DSCEngine.sol:DSCEngine",
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`DSCEngine deployed at: ${dscEngine.address}`);
  log("________________________________________");

  if (!developmentChain.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying on Etherscan...");
    await verify(dscEngine.address, args);
  }
};

module.exports.tags = ["all", "dscengine"];
