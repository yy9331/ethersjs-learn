import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const testProviders = async () => {
    console.log("测试不同的 RPC 提供商...\n");
    
    // 1. 测试默认 provider
    try {
        console.log("1. 测试默认 provider...");
        const defaultProvider = ethers.getDefaultProvider();
        const balance = await defaultProvider.getBalance("vitalik.eth");
        console.log(`✅ 默认 provider 成功: ${ethers.formatEther(balance)} ETH\n`);
    } catch (error) {
        console.log(`❌ 默认 provider 失败: ${error.message}\n`);
    }
    
    // 2. 测试 Infura (如果配置了)
    if (process.env.MAINNET_RPC_URL_INFURA) {
        try {
            console.log("2. 测试 Infura provider...");
            const infuraProvider = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL_INFURA);
            const balance = await infuraProvider.getBalance("vitalik.eth");
            console.log(`✅ Infura provider 成功: ${ethers.formatEther(balance)} ETH\n`);
        } catch (error) {
            console.log(`❌ Infura provider 失败: ${error.message}\n`);
        }
    } else {
        console.log("2. Infura RPC URL 未配置\n");
    }
    
    // 3. 测试 Alchemy (如果配置了)
    if (process.env.MAINNET_RPC_URL_ALCHEMY) {
        try {
            console.log("3. 测试 Alchemy provider...");
            const alchemyProvider = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL_ALCHEMY);
            const balance = await alchemyProvider.getBalance("vitalik.eth");
            console.log(`✅ Alchemy provider 成功: ${ethers.formatEther(balance)} ETH\n`);
        } catch (error) {
            console.log(`❌ Alchemy provider 失败: ${error.message}\n`);
        }
    } else {
        console.log("3. Alchemy RPC URL 未配置\n");
    }
    
    console.log("测试完成！");
};

testProviders(); 