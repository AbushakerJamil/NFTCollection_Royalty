const { network, ethers } = require("hardhat");
const { developmentChain } = require("../helper-hardhat-config");

const INITIAL_ANSWER = ethers.parseUnits("2000", 8); // ETH price mock

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (developmentChain.includes(network.name)) {
        log("Local network detected. Deploying mocks...");
        
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [8, INITIAL_ANSWER], // decimals, initial answer
            log: true,
        });

        log("Mocks Deployed!");
        log("________________________________________");
    }
};

module.exports.tags = ["all", "mocks"];