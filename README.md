# NFTCollection - ERC-721 Smart Contract

A production-ready ERC-721 NFT smart contract with advanced features including minting controls, royalty support, and pausable functionality.

![NFT](./svg/nft.svg)
![NFT](./svg/nft2.svg)


## ✨ Features

### Core Functionality
- ✅ **ERC-721 Standard Compliance** - Full NFT standard implementation
- ✅ **Supply Cap** - Maximum 10,000 NFTs with built-in scarcity
- ✅ **Public Minting** - Users can mint NFTs by paying the mint price
- ✅ **Owner Minting** - Free minting for airdrops and team allocation
- ✅ **Wallet Limits** - Maximum 5 NFTs per wallet to prevent whales
- ✅ **Pausable Minting** - Owner can enable/disable minting anytime

### Advanced Features
-  **Ownership Controls** - OpenZeppelin Ownable for secure access
-  **EIP-2981 Royalties** - Built-in 5% royalty support for secondary sales
-  **Metadata Storage** - ERC721URIStorage for flexible metadata management
-  **Event Emissions** - Comprehensive event logging for indexing
-  **Security Audited Libraries** - Uses battle-tested OpenZeppelin contracts


## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AbushakerJamil/NFTCollection_Royalty
cd NFTCollection_Royalty
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install OpenZeppelin Contracts

```bash
npm install @openzeppelin/contracts
```

### 4. Install Development Tools

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

## ⚙️ Configuration

### 1. Create Environment File

Create a `.env` file in the root directory:

```bash
# Network RPC URLs
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# Private Keys (NEVER SHARE OR COMMIT!)
PRIVATE_KEY=your_wallet_private_key_here

# Etherscan API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Contract Configuration
MINT_PRICE=0.05
MAX_SUPPLY=10000
MAX_PER_WALLET=5
BASE_URI=https://ipfs.io/ipfs/YOUR_IPFS_HASH/

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Deploy to Mainnet

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## 📖 Usage

### Interacting with the Contract

#### Using Hardhat Console

```bash
npx hardhat console --network sepolia
```

## 📝 Contract Details

## 🧪 Testing

### Run Tests

```bash
npx hardhat test
```

### Sample Test File (`test/NFTCollection.test.js`)

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFTCollection", function () {
  let nft, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const NFT = await ethers.getContractFactory("MyNFTCollection");
    nft = await NFT.deploy("Test NFT", "TNFT", "https://test.com/");
    await nft.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await nft.name()).to.equal("Test NFT");
      expect(await nft.symbol()).to.equal("TNFT");
    });
  });

  describe("Minting", function () {
    it("Should fail if minting is not enabled", async function () {
      await expect(
        nft.connect(addr1).mint(1, { value: ethers.parseEther("0.05") })
      ).to.be.revertedWith("Minting is not enabled");
    });

    it("Should mint NFTs when enabled", async function () {
      await nft.toggleMinting();
      
      await nft.connect(addr1).mint(2, { 
        value: ethers.parseEther("0.1") 
      });
      
      expect(await nft.balanceOf(addr1.address)).to.equal(2);
      expect(await nft.totalSupply()).to.equal(2);
    });

    it("Should enforce max per wallet", async function () {
      await nft.toggleMinting();
      
      await expect(
        nft.connect(addr1).mint(6, { value: ethers.parseEther("0.3") })
      ).to.be.revertedWith("Exceeds max per wallet");
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to mint for free", async function () {
      await nft.ownerMint(addr1.address, 3);
      expect(await nft.balanceOf(addr1.address)).to.equal(3);
    });

    it("Should allow owner to withdraw funds", async function () {
      await nft.toggleMinting();
      await nft.connect(addr1).mint(1, { 
        value: ethers.parseEther("0.05") 
      });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await nft.withdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });
});
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Website:** https://abushakerjamil.vercel.app/
- **LinkDine:** https://www.linkedin.com/in/abushaker-jamil-1b414b224/
- **Email:** abushakerjamil254@gmail.com

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) - For secure smart contract libraries
- [Hardhat](https://hardhat.org/) - For excellent development tools
- [Ethereum Community](https://ethereum.org/) - For continuous innovation

---

**⚠️ Disclaimer:** This is educational software. Use at your own risk. Always perform thorough testing and security audits before deploying to mainnet.

Made with ❤️ by [A. Jamil]