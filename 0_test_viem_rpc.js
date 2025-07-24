import { createPublicClient, http } from "viem";
import { getBalance, getEnsAddress } from "viem/actions";
import { mainnet } from "viem/chains";

// 测试不同的 RPC 配置
const testRPCConfigs = async () => {
    console.log("测试 viem 的 RPC 配置...\n");
    
    // 1. 默认配置（自动选择 RPC）
    try {
        console.log("1. 测试默认配置（自动选择 RPC）...");
        const defaultClient = createPublicClient({
            chain: mainnet,
            transport: http()
        });
        
        const address = await getEnsAddress(defaultClient, { name: "vitalik.eth" });
        const balance = await getBalance(defaultClient, { address });
        
        console.log(`✅ 默认配置成功: ${address}`);
        console.log(`   余额: ${Number(balance) / 10**18} ETH\n`);
    } catch (error) {
        console.log(`❌ 默认配置失败: ${error.message}\n`);
    }
    
    // 2. 指定公共 RPC
    try {
        console.log("2. 测试指定公共 RPC...");
        const publicClient = createPublicClient({
            chain: mainnet,
            transport: http("https://eth.merkle.io")
        });
        
        const address = await getEnsAddress(publicClient, { name: "vitalik.eth" });
        const balance = await getBalance(publicClient, { address });
        
        console.log(`✅ 公共 RPC 成功: ${address}`);
        console.log(`   余额: ${Number(balance) / 10**18} ETH\n`);
    } catch (error) {
        console.log(`❌ 公共 RPC 失败: ${error.message}\n`);
    }
    
    // 3. 测试多个备用 RPC
    const rpcUrls = [
        "https://eth.merkle.io",
        "https://cloudflare-eth.com",
        "https://rpc.ankr.com/eth"
    ];
    
    for (let i = 0; i < rpcUrls.length; i++) {
        try {
            console.log(`3.${i + 1} 测试 RPC: ${rpcUrls[i]}...`);
            const client = createPublicClient({
                chain: mainnet,
                transport: http(rpcUrls[i])
            });
            
            const address = await getEnsAddress(client, { name: "vitalik.eth" });
            const balance = await getBalance(client, { address });
            
            console.log(`✅ RPC ${i + 1} 成功: ${address}`);
            console.log(`   余额: ${Number(balance) / 10**18} ETH\n`);
            break; // 成功就停止测试
        } catch (error) {
            console.log(`❌ RPC ${i + 1} 失败: ${error.message}\n`);
        }
    }
    
    console.log("测试完成！");
};

// viem 的 RPC 配置测试结果: viem 从来不会有 RPC timeout 或者被限制的问题: v ^_^ v
testRPCConfigs(); 
// 测试 viem 的 RPC 配置...

// 1. 测试默认配置（自动选择 RPC）...
// ✅ 默认配置成功: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
//    余额: 4.7795871263457315 ETH

// 2. 测试指定公共 RPC...
// ✅ 公共 RPC 成功: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
//    余额: 4.7795871263457315 ETH

// 3.1 测试 RPC: https://eth.merkle.io...
// ✅ RPC 1 成功: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
//    余额: 4.7795871263457315 ETH

// 测试完成！