// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract NFTWhitelist is ERC721, Ownable {
    using MerkleProof for bytes32[];
    
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public constant MINT_PRICE = 0.1 ether;
    uint256 public constant WHITELIST_MINT_PRICE = 0.05 ether;
    
    bytes32 public merkleRoot;
    uint256 public totalMinted;
    bool public whitelistMintEnabled = false;
    bool public publicMintEnabled = false;
    
    mapping(address => bool) public hasMinted;
    
    constructor() ERC721("Whitelist NFT", "WNFT") {}
    
    // 设置Merkle Root（只有合约拥有者可以调用）
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }
    
    // 启用/禁用白名单铸造
    function setWhitelistMintEnabled(bool _enabled) external onlyOwner {
        whitelistMintEnabled = _enabled;
    }
    
    // 启用/禁用公开铸造
    function setPublicMintEnabled(bool _enabled) external onlyOwner {
        publicMintEnabled = _enabled;
    }
    
    // 白名单铸造函数
    function whitelistMint(bytes32[] calldata _proof) external payable {
        require(whitelistMintEnabled, "Whitelist mint not enabled");
        require(totalMinted < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= WHITELIST_MINT_PRICE, "Insufficient payment");
        require(!hasMinted[msg.sender], "Already minted");
        
        // 验证Merkle证明
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(_proof, merkleRoot, leaf), "Invalid proof");
        
        hasMinted[msg.sender] = true;
        totalMinted++;
        _mint(msg.sender, totalMinted);
    }
    
    // 公开铸造函数
    function publicMint() external payable {
        require(publicMintEnabled, "Public mint not enabled");
        require(totalMinted < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(!hasMinted[msg.sender], "Already minted");
        
        hasMinted[msg.sender] = true;
        totalMinted++;
        _mint(msg.sender, totalMinted);
    }
    
    // 验证地址是否在白名单中（链下验证）
    function verifyWhitelist(address _user, bytes32[] calldata _proof) 
        external 
        view 
        returns (bool) 
    {
        bytes32 leaf = keccak256(abi.encodePacked(_user));
        return MerkleProof.verify(_proof, merkleRoot, leaf);
    }
    
    // 提取合约余额
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // 获取合约信息
    function getContractInfo() external view returns (
        uint256 _totalMinted,
        uint256 _maxSupply,
        uint256 _whitelistPrice,
        uint256 _publicPrice,
        bool _whitelistEnabled,
        bool _publicEnabled
    ) {
        return (
            totalMinted,
            MAX_SUPPLY,
            WHITELIST_MINT_PRICE,
            MINT_PRICE,
            whitelistMintEnabled,
            publicMintEnabled
        );
    }
} 