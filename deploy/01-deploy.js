const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("Deploying MyNFTCollection...");
  log("----------------------------------------------------");

  // NFT Collection Configuration
  const NFT_NAME = "My Amazing NFT Collection";
  const NFT_SYMBOL = "MANFT";
  const BASE_URI = "";

  const args = [NFT_NAME, NFT_SYMBOL, BASE_URI];

  const nftCollection = await deploy("NFTCollection", {
    contract: "contracts/NFTCollection.sol:NFTCollection",
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`NFTCollection deployed at: ${nftCollection.address}`);
  log("----------------------------------------------------");

  // Verify contract on Etherscan
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log(" Verifying contract on Etherscan...");
    await verify(nftCollection.address, args);
    log("✅Contract verified successfully!");
  }

  // Post-deployment setup
  log("----------------------------------------------------");
  log("📋 Post-Deployment Information:");
  log(`Contract Address: ${nftCollection.address}`);
  log(`Network: ${network.name}`);
  log(`Deployer: ${deployer}`);

};

module.exports.tags = ["all", "nft", "main"];