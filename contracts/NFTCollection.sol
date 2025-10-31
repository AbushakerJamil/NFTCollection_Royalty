// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @dev A. Jamil
 * @title NFTCollection
 * @dev ERC721 NFT Contract with minting functionality, supply cap, and royalties
 */
contract NFTCollection is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MINT_PRICE = 0.05 ether;
    uint256 public constant MAX_PER_WALLET = 5;
    
    string private _baseTokenURI;
    
    mapping(address => uint256) public mintsPerWallet;
    
    bool public mintingEnabled = false;
    
    address public royaltyReceiver;
    uint96 public royaltyFeeNumerator = 500; // 5% (500/10000)
    
    // Events
    event NFTMinted(address indexed minter, uint256 tokenId);
    event BaseURIUpdated(string newBaseURI);
    event MintingToggled(bool enabled);
    event RoyaltyUpdated(address receiver, uint96 feeNumerator);
    
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        royaltyReceiver = msg.sender;
    }
    
    /**
     * @dev Public mint function
     * @param quantity Number of NFTs to mint
     */
    function mint(uint256 quantity) external payable {
        require(mintingEnabled, "Minting is not enabled");
        require(quantity > 0, "Must mint at least 1");
        require(_tokenIds.current() + quantity <= MAX_SUPPLY, "Exceeds max supply");
        require(msg.value >= MINT_PRICE * quantity, "Insufficient payment");
        require(mintsPerWallet[msg.sender] + quantity <= MAX_PER_WALLET, "Exceeds max per wallet");
        
        mintsPerWallet[msg.sender] += quantity;
        
        for (uint256 i = 0; i < quantity; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            _safeMint(msg.sender, newTokenId);
            emit NFTMinted(msg.sender, newTokenId);
        }
    }
    
    /**
     * @dev Owner can mint for free (airdrops, team allocation)
     * @param to Recipient address
     * @param quantity Number to mint
     */

    function ownerMint(address to, uint256 quantity) external onlyOwner {
        require(_tokenIds.current() + quantity <= MAX_SUPPLY, "Exceeds max supply");
        
        for (uint256 i = 0; i < quantity; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            _safeMint(to, newTokenId);
            emit NFTMinted(to, newTokenId);
        }
    }
    
    /**
     * @dev Toggle minting on/off
     */
    function toggleMinting() external onlyOwner {
        mintingEnabled = !mintingEnabled;
        emit MintingToggled(mintingEnabled);
    }
    
    /**
     * @dev Update base URI for metadata
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }
    
    /**
     * @dev Set royalty information
     * @param receiver Address to receive royalties
     * @param feeNumerator Royalty fee (e.g., 500 = 5%)
     */
    function setRoyaltyInfo(address receiver, uint96 feeNumerator) external onlyOwner {
        require(feeNumerator <= 1000, "Royalty fee too high"); // Max 10%
        royaltyReceiver = receiver;
        royaltyFeeNumerator = feeNumerator;
        emit RoyaltyUpdated(receiver, feeNumerator);
    }
    
    /**
     * @dev Withdraw contract balance to owner
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Get total minted count
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Returns the base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev EIP-2981 royalty info
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        uint256 royalty = (salePrice * royaltyFeeNumerator) / 10000;
        return (royaltyReceiver, royalty);
    }
    
    /**
     * @dev Check if contract supports an interface
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return interfaceId == 0x2a55205a || super.supportsInterface(interfaceId); // EIP-2981
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}