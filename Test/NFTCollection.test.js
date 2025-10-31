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