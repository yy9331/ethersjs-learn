import { createPublicClient, http } from "viem";
import { getBalance, getEnsAddress } from "viem/actions";
import { mainnet } from "viem/chains";

// 创建公共客户端
const client = createPublicClient({
    chain: mainnet,
    transport: http()
});

const main = async () => {
    try {
        console.log("正在查询 Vitalik 的 ETH 余额...");
        
        // 先解析 ENS 地址
        const address = await getEnsAddress(client, {
            name: "vitalik.eth"
        });
        
        if (!address) throw new Error("无法解析 ENS 地址");
        
        console.log(`解析的地址: ${address}`);
        
        // 使用解析后的地址查询余额
        const balance = await getBalance(client, {
            address: address
        });
        
        console.log(`Vitalik 的 ETH 余额: ${balance} wei`);
        console.log(`Vitalik 的 ETH 余额: ${Number(balance) / 10**18} ETH`);
        
    } catch (error) {
        console.error("查询失败:", error.message);
    }
}

main(); 
// 正在查询 Vitalik 的 ETH 余额...
// 解析的地址: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
// Vitalik 的 ETH 余额: 4779587126345731315 wei
// Vitalik 的 ETH 余额: 4.7795871263457315 ETH