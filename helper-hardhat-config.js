const networkConfig = {
    31337: {
        name: "hardhat",
    },
    11155111: {
        name: "sepolia",
    },
    1: {
        name: "mainnet",
    },
};

const developmentChain = ["hardhat", "localhost"];

module.exports = {
    networkConfig,
    developmentChain,
};