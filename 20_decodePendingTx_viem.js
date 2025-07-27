import { createPublicClient, webSocket, parseAbiItem, decodeFunctionData } from "viem";
import { sepolia } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();

// 1. 创建 WebSocket 客户端
console.log("\n1. 连接 wss RPC");
const publicClient = createPublicClient({
    chain: sepolia,
    transport: webSocket(process.env.SEPOLIA_WSSURL)
});

// 2. 创建 ABI 接口，用于解码交易详情
const transferAbi = parseAbiItem("function transfer(address, uint256) returns (bool)");
const selector = "0xa9059cbb"; // transfer 函数的选择器
console.log(`函数选择器是: ${selector}`);

// 3. 监听 pending 交易，解码 ERC20 transfer 交易
let j = 0;
publicClient.watchPendingTransactions({
    onTransactions: async (txHashes) => {
        for (const txHash of txHashes) {
            console.log(`Etherscan链接: https://sepolia.etherscan.io/tx/${txHash}`);
            
            try {
                const tx = await publicClient.getTransaction({ hash: txHash });
                j++;
                
                if (tx && tx.data.startsWith(selector)) {
                    console.log(`[${new Date().toLocaleTimeString()}]监听到第${j}个pending交易: ${txHash}`);
                    
                    // 解码交易数据
                    const decoded = decodeFunctionData({
                        abi: [transferAbi],
                        data: tx.data
                    });
                    
                    console.log(`打印解码交易详情: ${JSON.stringify(decoded, null, 2)}`);
                    console.log(`转账目标地址: ${decoded.args[0]}`);
                    console.log(`转账金额: ${decoded.args[1]}`);
                    
                    // 找到匹配的交易后停止监听
                    return;
                }
            } catch (err) {
                // 查不到详情时静默跳过
            }
        }
    }
});

console.log("开始监听 pending 交易...");
console.log("等待 ERC20 transfer 交易..."); 