import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import { providerSepoliaInfura as provider, walletSepoliaInfura as wallet } from "./0_init.js";
import contractJson from './17_contract.json' assert { type: 'json' };

console.log("=== 默克尔树NFT铸造系统 ===");

// 1. 生成默克尔树
console.log("1. 生成默克尔树");
// 白名单地址
const whitelistAddresses = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];

// 生成叶子节点（地址的哈希）
const leaves = whitelistAddresses.map(x => ethers.keccak256(x));
const merkletree = new MerkleTree(leaves, ethers.keccak256, { sortPairs: true });
const root = merkletree.getHexRoot();

console.log("白名单地址:");
console.log(whitelistAddresses);
console.log("默克尔根:", root);

// 2. 验证地址是否在白名单中
function verifyWhitelist(address) {
    const leaf = ethers.keccak256(address);
    const proof = merkletree.getHexProof(leaf);
    // * 关键 merkle tree 验证步骤, .verify API, 传入的参数:
    // * 1. 该地址的验证证明, .getHexProof(ethers.keccak256(addr)) , 该地址必须经keccak256编码后, 再用 merkletree 的getHexProof 16进制的编码 
    // * 2. 叶子节点经过 keccak256 编码的hash值
    // * 3. 根节点哈希值, 由 .getHexRoot() 生成
    const isValid = merkletree.verify(proof, leaf, root); 
    
    console.log(`验证地址: ${address}`);
    console.log(`叶子节点: ${leaf}`);
    console.log(`默克尔证明: ${JSON.stringify(proof)}`);
    console.log(`是否在白名单中: ${isValid}`);
    
    return { isValid, proof };
}

// 3. 测试验证功能
console.log("2. 测试白名单验证");
const testAddresses = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", // 在白名单中
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", // 在白名单中
    "0x1234567890123456789012345678901234567890"   // 不在白名单中
];

testAddresses.forEach(address => {
    verifyWhitelist(address);
});

// 4. 从JSON文件获取合约信息
const bytecodeNFT = contractJson.data.bytecode.object;
const abiNFT = contractJson.abi;

console.log("3. 合约信息");
console.log("字节码长度:", bytecodeNFT.length);
console.log("字节码是否以0x开头:", bytecodeNFT.startsWith("0x"));
console.log("ABI函数数量:", abiNFT.length);

// 5. 主要功能
const main = async () => {
    try {
        console.log("4. 检查钱包余额");
        const balanceETH = await provider.getBalance(wallet);
        console.log("钱包余额:", ethers.formatEther(balanceETH), "ETH");
        
        if (bytecodeNFT.length === 0) {
            console.log("⚠️  字节码为空，请检查JSON文件");
            return;
        }
        
        console.log("5. 部署NFT合约");
        const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);
        
        // 部署参数：合约名称、符号、默克尔根
        const contractName = "MerkleNFT";
        const contractSymbol = "MNFT";
        
        console.log("部署参数:");
        console.log("- 名称:", contractName);
        console.log("- 符号:", contractSymbol);
        console.log("- 默克尔根:", root);
        
        const nftContract = await factoryNFT.deploy(contractName, contractSymbol, root);
        await nftContract.waitForDeployment();
        
        const contractAddress = await nftContract.getAddress();
        console.log("✅ 合约部署成功！地址:", contractAddress);
        
        console.log("6. 铸造NFT");
        const tokenId = 1;
        const mintToAddress = whitelistAddresses[0]; // 使用白名单中的第一个地址
        
        // 获取该地址的默克尔证明
        const { isValid, proof } = verifyWhitelist(mintToAddress);
        
        if (!isValid) {
            console.log("❌ 地址不在白名单中，无法铸造");
            return;
        }
        
        console.log("铸造参数:");
        console.log("- 接收地址:", mintToAddress);
        console.log("- Token ID:", tokenId);
        console.log("- 默克尔证明:", proof);
        
        const mintTx = await nftContract.mint(mintToAddress, tokenId, proof);
        await mintTx.wait();
        
        console.log("✅ NFT铸造成功！");
        
        // 验证铸造结果
        const owner = await nftContract.ownerOf(tokenId);
        console.log("Token", tokenId, "的所有者:", owner);
        
        const balance = await nftContract.balanceOf(mintToAddress);
        console.log("地址", mintToAddress, "的NFT余额:", balance.toString());
        
        // 7. 测试非白名单地址铸造（应该失败）
        console.log("7. 测试非白名单地址铸造");
        const nonWhitelistAddress = "0x1234567890123456789012345678901234567890";
        const { proof: invalidProof } = verifyWhitelist(nonWhitelistAddress);
        
        try {
            const invalidMintTx = await nftContract.mint(nonWhitelistAddress, 2, invalidProof);
            await invalidMintTx.wait();
            console.log("❌ 非白名单地址铸造成功（不应该发生）");
        } catch (error) {
            console.log("✅ 非白名单地址铸造失败（符合预期）");
            console.log("错误信息:", error.message);
        }
        
    } catch (error) {
        console.error("❌ 错误:", error);
    }
}

// 8. 离线验证功能（不依赖网络）
function offlineVerification() {
    console.log("8. 离线验证功能");
    
    // 验证所有白名单地址
    whitelistAddresses.forEach((address, index) => {
        const { isValid, proof } = verifyWhitelist(address);
        console.log(`地址 ${index + 1}: ${isValid ? '✅' : '❌'} ${address}`);
    });
    
    // 验证非白名单地址
    const nonWhitelistAddress = "0x1234567890123456789012345678901234567890";
    const { isValid } = verifyWhitelist(nonWhitelistAddress);
    console.log(`非白名单地址: ${isValid ? '❌' : '✅'} ${nonWhitelistAddress}`);
}

// 运行离线验证
offlineVerification();

// 运行主程序
main();