// viem WebSocket 版本的事件监听
// 使用 WebSocket 传输实现真正的实时监听

import { createPublicClient, webSocket, formatUnits, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";
import { contractAddressUSDT } from "./0_init_ethersjs.js";
import dotenv from "dotenv";
dotenv.config();


// 创建 WebSocket 客户端
const publicClient = createPublicClient({
    chain: mainnet,
    transport: webSocket(process.env.SEPOLIA_WSSURL) // 使用 WebSocket RPC
});

// 定义 Transfer 事件
const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 amount)");

const main = async () => {
    try {
        console.log("正在连接到 USDT 合约:", contractAddressUSDT);
        
        // 测试连接
        const blockNumber = await publicClient.getBlockNumber();
        console.log("当前区块高度:", blockNumber);
        
        console.log("1. 使用 WebSocket 实时监听 Transfer 事件");
        
        // 使用 WebSocket 监听合约事件
        const unwatch = publicClient.watchContractEvent({
            address: contractAddressUSDT,
            event: transferEvent,
            onLogs: (logs) => {
                console.log(`\n[${new Date().toLocaleTimeString()}] 监听到 ${logs.length} 个新的 Transfer 事件:`);
                logs.forEach((log, index) => {
                    const from = '0x' + log.topics[1].slice(26);
                    const to = '0x' + log.topics[2].slice(26);
                    const value = formatUnits(log.data, 6);
                    
                    console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
                });
            },
            onError: (error) => {
                console.error("WebSocket 监听错误:", error);
            }
        });
        
        // 查询最近的 Transfer 事件作为示例
        console.log("2. 查询最近1000个区块的 Transfer 事件作为示例");
        const recentEvents = await publicClient.getLogs({
            address: contractAddressUSDT,
            event: transferEvent,
            fromBlock: blockNumber - 1000n,
            toBlock: blockNumber
        });
        
        console.log(`最近10个区块中找到 ${recentEvents.length} 个 Transfer 事件`);
        
        if (recentEvents.length > 0) {
            console.log("最近的 Transfer 事件示例:");
            recentEvents.slice(0, 3).forEach((log, index) => {
                const from = '0x' + log.topics[1].slice(26);
                const to = '0x' + log.topics[2].slice(26);
                const value = formatUnits(log.data, 6);
                
                console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
            });
        }
        
        console.log("WebSocket 监听器已启动，按 Ctrl+C 停止...");
        
        // 设置超时停止监听
        setTimeout(() => {
            console.log("停止 WebSocket 监听...");
            unwatch();
            process.exit(0);
        }, 30000); // 30秒后停止

    } catch (e) {
        console.log("连接错误:", e);
        console.log("请确保设置了正确的 MAINNET_WSSURL 环境变量");
    }
};

main(); 