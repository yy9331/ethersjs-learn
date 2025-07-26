import {ethers} from 'ethers'
import { providerSepoliaInfura as provider, walletSepoliaInfura as wallet } from './0_init_ethersjs.js'

const main = async () => {
    try {
        // 1. 部署这份合约:
        // 2. 复制 Remix 下的 artifacts/SignatureNFT.json, 放到 18_contract.json里
        // 3. 粘贴合约地址: 部署后粘贴在这里
        const contractAddress = "0xA6E44D8Ce0e91f29793c8519aDbD32Ef9726734e" // 请替换为你的合约地址
        const contractNFT = new ethers.Contract(contractAddress, [
            "function mint(address account, uint256 tokenId, bytes calldata signature) public payable",
            "function owner() public view returns (address)",
            "function name() public view returns (string)",
            "function symbol() public view returns (string)",
            "function balanceOf(address owner) public view returns (uint256)",
            "function hasMinted(address account) public view returns (bool)",
            "function totalSupply() public view returns (uint256)"
        ], wallet);
        
        console.log(`使用合约地址: ${contractAddress}`)

        // 获取合约所有者
        const contractOwner = await contractNFT.owner();
        console.log(`合约所有者: ${contractOwner}`);
        console.log(`当前钱包地址: ${wallet.address}`);
        
        // 检查当前钱包是否是合约所有者
        if (wallet.address.toLowerCase() !== contractOwner.toLowerCase()) {
            console.log("❌ 当前钱包不是合约所有者，无法进行签名验证的铸造");
            console.log("💡 请使用合约所有者的私钥来运行此脚本");
            return;
        }

        // 铸造参数
        const account = wallet.address; // 铸造给当前钱包
        const tokenId = "0";
        
        console.log(`铸造地址: ${account}`);
        console.log(`Token ID: ${tokenId}`);

        // 生成消息哈希
        const msgHash = ethers.solidityPackedKeccak256(
            ['address', 'uint256'],
            [account, tokenId])
        console.log(`消息哈希: ${msgHash}`)

        // 签名
        const msgHashBytes = ethers.getBytes(msgHash)
        const signature = await wallet.signMessage(msgHashBytes)
        console.log(`签名: ${signature}`)
        
        // 验证签名
        const recoveredAddress = ethers.verifyMessage(msgHashBytes, signature)
        console.log(`恢复的签名者地址: ${recoveredAddress}`)
        console.log(`签名者是否匹配: ${recoveredAddress.toLowerCase() === contractOwner.toLowerCase()}`)

        // 读取钱包内ETH余额
        const balanceETH = await provider.getBalance(wallet)
        console.log(`钱包ETH余额: ${ethers.formatEther(balanceETH)} ETH`)

        // 检查是否已经铸造过
        const hasMinted = await contractNFT.hasMinted(account);
        console.log(`是否已经铸造过: ${hasMinted}`);
        
        if (hasMinted) {
            console.log("⚠️ 该地址已经铸造过NFT，跳过铸造");
            return;
        }

        // 如果钱包ETH足够
        if(ethers.formatEther(balanceETH) > 0.002){
            console.log("\n开始铸造NFT...")
            console.log(`NFT名称: ${await contractNFT.name()}`)
            console.log(`NFT代号: ${await contractNFT.symbol()}`)
            
            try {
                // 铸造NFT
                const tx = await contractNFT.mint(account, tokenId, signature, { value: 0 })
                console.log("铸造中，等待交易上链...")
                console.log(`交易哈希: ${tx.hash}`)
                
                await tx.wait()
                console.log("✅ 铸造成功！")
                
                // 查询铸造结果
                const balance = await contractNFT.balanceOf(account);
                const totalSupply = await contractNFT.totalSupply();
                console.log(`地址 ${account} 的NFT余额: ${balance}`);
                console.log(`合约总供应量: ${totalSupply}`);
                
            } catch (mintError) {
                console.error("❌ 铸造失败:", mintError.message);
                if (mintError.message.includes("Invalid signature")) {
                    console.log("💡 签名验证失败，请检查合约所有者是否正确");
                } else if (mintError.message.includes("Already minted")) {
                    console.log("💡 该地址已经铸造过NFT");
                }
            }
        } else {
            console.log("❌ ETH不足，去水龙头领一些Sepolia ETH")
            console.log("1. chainlink水龙头: https://faucets.chain.link/sepolia")
            console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/")
        }
    } catch (error) {
        console.error("❌ 程序执行错误:", error.message);
    }
}

main()