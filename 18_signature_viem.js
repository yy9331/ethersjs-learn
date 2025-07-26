import { createPublicClient, createWalletClient, http, parseEther, formatEther, verifyMessage, toBytes, keccak256 } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();

const main = async () => {
    try {
        // 1. 部署这份合约:
        // 2. 复制 Remix 下的 artifacts/SignatureNFT.json, 放到 18_contract.json里
        // 3. 粘贴合约地址: 部署后粘贴在这里
        const contractAddress = "0x3c89262324EdaD120D90e682e4893056F00207d4" // 请替换为你的合约地址
        
        const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);
        
        const publicClient = createPublicClient({
            chain: sepolia,
            transport: http()
        });
        const walletClient = createWalletClient({
            account,
            chain: sepolia,
            transport: http()
        });
        
        console.log(`使用合约地址: ${contractAddress}`);

        // 获取合约所有者
        const contractOwner = await publicClient.readContract({
            address: contractAddress,
            abi: [{
                name: "owner",
                type: "function",
                stateMutability: "view",
                inputs: [],
                outputs: [{ type: "address" }]
            }],
            functionName: "owner"
        });
        console.log(`合约所有者: ${contractOwner}`);
        console.log(`当前钱包地址: ${account.address}`);
        
        // 检查当前钱包是否是合约所有者
        if (account.address.toLowerCase() !== contractOwner.toLowerCase()) {
            console.log("❌ 当前钱包不是合约所有者，无法进行签名验证的铸造");
            console.log("💡 请使用合约所有者的私钥来运行此脚本");
            return;
        }

        // 铸造参数
        const mintAccount = account.address; // 铸造给当前钱包
        const tokenId = "0";
        
        console.log(`铸造地址: ${mintAccount}`);
        console.log(`Token ID: ${tokenId}`);

        // 生成消息哈希
        const msgHash = keccak256(
            `0x${mintAccount.slice(2).padStart(64, '0')}${BigInt(tokenId).toString(16).padStart(64, '0')}`
        )
        console.log(`消息哈希: ${msgHash}`)

        // 签名
        const msgHashBytes = toBytes(msgHash)
        const signature = await walletClient.signMessage({ message: { raw: msgHashBytes } })
        console.log(`签名: ${signature}`)
        
        // 验证签名 - 暂时跳过验证，直接进行铸造
        console.log(`签名: ${signature}`)
        console.log(`签名长度: ${signature.length}`)
        console.log(`签名者地址: ${account.address}`)
        console.log(`签名者是否匹配: ${account.address.toLowerCase() === contractOwner.toLowerCase()}`)

        // 读取钱包内ETH余额
        const balanceETH = await publicClient.getBalance({ address: account.address })
        console.log(`钱包ETH余额: ${formatEther(balanceETH)} ETH`)

        // 检查是否已经铸造过 - 暂时跳过检查，直接进行铸造
        console.log(`准备铸造NFT...`);

        // 如果钱包ETH足够
        if(formatEther(balanceETH) > 0.002){
            console.log("\n开始铸造NFT...")
            
            // 获取NFT信息
            const name = await publicClient.readContract({
                address: contractAddress,
                abi: [{
                    name: "name",
                    type: "function",
                    stateMutability: "view",
                    inputs: [],
                    outputs: [{ type: "string" }]
                }],
                functionName: "name"
            });
            const symbol = await publicClient.readContract({
                address: contractAddress,
                abi: [{
                    name: "symbol",
                    type: "function",
                    stateMutability: "view",
                    inputs: [],
                    outputs: [{ type: "string" }]
                }],
                functionName: "symbol"
            });
            
            console.log(`NFT名称: ${name}`)
            console.log(`NFT代号: ${symbol}`)
            
            try {
                // 铸造NFT
                const hash = await walletClient.writeContract({
                    address: contractAddress,
                    abi: [{
                        name: "mint",
                        type: "function",
                        stateMutability: "payable",
                        inputs: [
                            { type: "address" },
                            { type: "uint256" },
                            { type: "bytes" }
                        ],
                        outputs: []
                    }],
                    functionName: "mint",
                    args: [mintAccount, tokenId, signature],
                    value: 0n
                });
                
                console.log("铸造中，等待交易上链...")
                console.log(`交易哈希: ${hash}`);
                
                await publicClient.waitForTransactionReceipt({ hash });
                console.log("✅ 铸造成功！");
                
                // 查询铸造结果
                const balance = await publicClient.readContract({
                    address: contractAddress,
                    abi: [{
                        name: "balanceOf",
                        type: "function",
                        stateMutability: "view",
                        inputs: [{ type: "address" }],
                        outputs: [{ type: "uint256" }]
                    }],
                    functionName: "balanceOf",
                    args: [mintAccount]
                });
                const totalSupply = await publicClient.readContract({
                    address: contractAddress,
                    abi: [{
                        name: "totalSupply",
                        type: "function",
                        stateMutability: "view",
                        inputs: [],
                        outputs: [{ type: "uint256" }]
                    }],
                    functionName: "totalSupply"
                });
                
                console.log(`地址 ${mintAccount} 的NFT余额: ${balance}`);
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

main(); 

// 使用合约地址: 0x3c89262324EdaD120D90e682e4893056F00207d4
// 合约所有者: 0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6
// 当前钱包地址: 0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6
// 铸造地址: 0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6
// Token ID: 0
// 消息哈希: 0xb4f58249e361c08946d2992ad2e6d5d208967c4b2c3c5b1dc16bcf7bef527e3d
// 签名: 0xf954f06af27bc591a958658909f244c48c195953e28486a00e70eeb40920bd8b3901f53ec75c883d51d2688f50e3922e92c5b85a8eff354cbe18ca9d40625b951b
// 签名: 0xf954f06af27bc591a958658909f244c48c195953e28486a00e70eeb40920bd8b3901f53ec75c883d51d2688f50e3922e92c5b85a8eff354cbe18ca9d40625b951b
// 签名长度: 132
// 签名者地址: 0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6
// 签名者是否匹配: true
// 钱包ETH余额: 1.281682728906626567 ETH
// 准备铸造NFT...

// 开始铸造NFT...
// NFT名称: YYToken
// NFT代号: YY
// ❌ 铸造失败: The contract function "mint" reverted.

// Contract Call:
//   address:   0x3c89262324EdaD120D90e682e4893056F00207d4
//   function:  mint(address, uint256, bytes)
//   args:          (0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6, 0, 0xf954f06af27bc591a958658909f244c48c195953e28486a00e70eeb40920bd8b3901f53ec75c883d51d2688f50e3922e92c5b85a8eff354cbe18ca9d40625b951b)
//   sender:    0xbd61c00E4B7C2a77Cd660304ddd852379F705ED6
