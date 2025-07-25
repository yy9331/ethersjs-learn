// 监听合约方法：
// 1. 持续监听
// publicClient.watchContractEvent()
// 2. 只监听一次
// publicClient.watchContractEvent() 配合 once 参数

import { createPublicClient, http, formatUnits, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";
import { contractAddressUSDT } from "./0_init_ethersjs.js";

// 使用免费的公共 RPC，避免 429 错误
const publicClient = createPublicClient({
    chain: mainnet,
    transport: http('https://eth.merkle.io') // 使用免费的公共 RPC
});

// 定义 Transfer 事件 - 修正参数名为 amount
const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 amount)");

const main = async () => {
    // 监听USDT合约的Transfer事件

    try {
        console.log("正在连接到 USDT 合约:", contractAddressUSDT);
        
        // 测试连接
        const blockNumber = await publicClient.getBlockNumber();
        console.log("当前区块高度:", blockNumber);
        
        // 由于免费 RPC 不支持 WebSocket，我们使用轮询方式模拟实时监听
        console.log("1. 使用轮询方式模拟实时监听 Transfer 事件");
        
        let lastProcessedBlock = Number(blockNumber);
        
        // 轮询函数
        const pollEvents = async () => {
            try {
                const currentBlock = await publicClient.getBlockNumber();
                const currentBlockNumber = Number(currentBlock);
                
                if (currentBlockNumber > lastProcessedBlock) {
                    console.log(`检查区块 ${lastProcessedBlock + 1} 到 ${currentBlockNumber} 的事件...`);
                    
                    const events = await publicClient.getLogs({
                        address: contractAddressUSDT,
                        event: transferEvent,
                        fromBlock: BigInt(lastProcessedBlock + 1),
                        toBlock: currentBlock
                    });
                    
                    if (events.length > 0) {
                        console.log(`找到 ${events.length} 个新的 Transfer 事件:`);
                        events.forEach((log, index) => {
                            const from = '0x' + log.topics[1].slice(26); // 移除前导零
                            const to = '0x' + log.topics[2].slice(26); // 移除前导零
                            const value = formatUnits(log.data, 6); // USDT 有6位小数
                            
                            console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
                        });
                    }
                    
                    lastProcessedBlock = currentBlockNumber;
                }
            } catch (error) {
                console.error("轮询错误:", error.message);
            }
        };
        
        // 开始轮询
        const pollInterval = setInterval(pollEvents, 5000); // 每5秒检查一次
        
        // 查询最近的 Transfer 事件作为示例
        console.log("2. 查询最近10个区块的 Transfer 事件作为示例");
        const recentEvents = await publicClient.getLogs({
            address: contractAddressUSDT,
            event: transferEvent,
            fromBlock: blockNumber - 10n,
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
        
        // 保持程序运行，让轮询继续工作
        console.log("轮询监听器已启动，按 Ctrl+C 停止...");
        
        // 可选：设置一个超时来停止监听
        setTimeout(() => {
            console.log("停止轮询监听...");
            clearInterval(pollInterval);
            process.exit(0);
        }, 20000); // 20秒后停止

    } catch (e) {
        console.log("连接错误:", e);
    }
};

main();
// 正在连接到 USDT 合约: 0xdac17f958d2ee523a2206206994597c13d831ec7
// 当前区块高度: 22993574n
// 1. 使用轮询方式模拟实时监听 Transfer 事件
// 2. 查询最近10个区块的 Transfer 事件作为示例
// 最近10个区块中找到 566 个 Transfer 事件
// 最近的 Transfer 事件示例:
// 1. 0x9642b23ed1e01df1092b92641051881a322f5d4e -> 0x1244d93e10d4e3939a33632528b500c00945f3c2 0x000000000000000000000000000000000000000000000000000000e8d4.94bc5 USDT
// 2. 0x82c2c52f977e709d7471cc602d0da3bacc87a2c5 -> 0xd6beeebca6b3f07ce116c977181119b24d00ee8f 0x0000000000000000000000000000000000000000000000000000000000.0f424 USDT
// 3. 0x46340b20830761efd32832a74d7169b29feb9758 -> 0x97b8944dd0f6af3c5c57353fc3a48510bbde3080 0x0000000000000000000000000000000000000000000000000000000019.de508 USDT
// 轮询监听器已启动，按 Ctrl+C 停止...
// 检查区块 22993575 到 22993575 的事件...
// 检查区块 22993575 到 22993575 的事件...
// 找到 33 个新的 Transfer 事件:
// 1. 0xa69babef1ca67a37ffaf7a485dfff3382056e78c -> 0x11b815efb8f581194ae79006d24e0d814b7697f6 0x0000000000000000000000000000000000000000000000000000001820.b6beb9 USDT
// 2. 0xa69babef1ca67a37ffaf7a485dfff3382056e78c -> 0x000000000004444c5dc75cb358380d2e3de08a90 0x0000000000000000000000000000000000000000000000000000001404.b514c9 USDT
// 3. 0xa69babef1ca67a37ffaf7a485dfff3382056e78c -> 0xc7bbec68d12a0d1830360f8ec58fa599ba1b0e9b 0x000000000000000000000000000000000000000000000000000000070a.235d42 USDT
// 4. 0x51c72848c68a965f66fa7a88855f9f7784502a7f -> 0x6ca298d2983ab03aa1da7679389d955a4efee15c 0x00000000000000000000000000000000000000000000000000000004be.a26103 USDT
// 5. 0x9a10da8ce77f26231860764a2caab36e70584c4b -> 0x897b61693b440a89c523687af8067c5b0213e511 0x0000000000000000000000000000000000000000000000000000000003.331225 USDT
// 6. 0xf89d7b9c864f589bbf53a82105107622b35eaa40 -> 0x18e296053cbdf986196903e889b7dca7a73882f6 0x000000000000000000000000000000000000000000000000000001d1a9.1c594 USDT
// 7. 0xedd5d7718b4a87bed5557e3d6079af2913a7f5da -> 0xc1ba706de602f589d5f76f4553ff69a3dcb4104c 0x0000000000000000000000000000000000000000000000000000000005.f62bec USDT
// 8. 0xe0e0e08a6a4b9dc7bd67bcb7aade5cf48157d444 -> 0xdf31a70a21a1931e02033dbba7deace6c45cfd0f 0x0000000000000000000000000000000000000000000000000000000000.902f35 USDT
// ... 太多省略