require("solidity-coverage");
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config({ debug: true });


// const SAPOLIA_RPC_URL_ = process.env.SAPOLIA_RPC_URL;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    localhost: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    // sepolia: {
    //   chainId: 11155111,
    //   url: SAPOLIA_RPC_URL_,
    //   accounts: [PRIVATE_KEY],
    //   blockConfirmations: 6,
    // },
  },
  solidity: {
    compilers: [
      { version: "0.8.19" },
      { version: "0.8.20" },
      { version: "0.6.6" },
    ],
  },
  // etherscan: {
  //   apiKey: ETHERSCAN_API_KEY,
  // },
  namedAccounts: {
    deployer: {
      default: 0,
      sepolia: 0,
    },
  },
  gasReporter: {
    enabled: false,
  },
};