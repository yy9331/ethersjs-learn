// viem WebSocket 版本的事件过滤
// 使用 WebSocket 传输实现真正的实时监听

import { createPublicClient, webSocket, formatUnits, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";
import { contractAddressUSDT, accountBinance } from "./0_init_ethersjs.js";
import dotenv from "dotenv";
dotenv.config();

// 创建 WebSocket 客户端
const publicClient = createPublicClient({
    chain: mainnet,
    transport: webSocket(process.env.MAINNET_WSSURL, {
        retryCount: 3,
        retryDelay: 1000,
    })
});

// 定义 Transfer 事件
const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 amount)");

// 定义 balanceOf 函数
const balanceOfAbi = parseAbiItem("function balanceOf(address owner) view returns (uint256)");

const main = async () => {
    try {
        console.log("使用 WebSocket URL:", process.env.MAINNET_WSSURL);
        console.log("正在测试 WebSocket 连接...");
        
        // 测试连接
        const testBlock = await publicClient.getBlockNumber();
        console.log("✅ WebSocket 连接成功！当前区块高度:", testBlock);
        
        // 1. 读取币安热钱包USDT余额
        console.log("1. 读取币安热钱包USDT余额");
        const balanceUSDT = await publicClient.readContract({
            address: contractAddressUSDT,
            abi: [balanceOfAbi],
            functionName: 'balanceOf',
            args: [accountBinance]
        });
        console.log(`USDT余额: ${formatUnits(balanceUSDT, 6)}\n`);

        // 2. 监听转入币安热钱包的事件
        console.log("2. 使用 WebSocket 监听 USDT 转入币安热钱包");
        console.log("过滤器详情：监听转入币安热钱包的交易");
        
        const unwatchIn = publicClient.watchContractEvent({
            address: contractAddressUSDT,
            event: transferEvent,
            args: {
                to: accountBinance // 只监听转入币安热钱包的事件
            },
            onLogs: (logs) => {
                if (logs.length > 0) {
                    console.log('\n---------监听USDT进入交易所--------');
                    logs.forEach((log, index) => {
                        const from = '0x' + log.topics[1].slice(26);
                        const to = '0x' + log.topics[2].slice(26);
                        const value = formatUnits(log.data, 6);
                        console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
                    });
                }
            },
            onError: (error) => {
                console.error("转入事件监听错误:", error);
            }
        });

        // 3. 监听转出币安热钱包的事件
        console.log("3. 使用 WebSocket 监听 USDT 转出币安热钱包");
        console.log("过滤器详情：监听转出币安热钱包的交易");
        
        const unwatchOut = publicClient.watchContractEvent({
            address: contractAddressUSDT,
            event: transferEvent,
            args: {
                from: accountBinance // 只监听转出币安热钱包的事件
            },
            onLogs: (logs) => {
                if (logs.length > 0) {
                    console.log('\n---------监听USDT转出交易所--------');
                    logs.forEach((log, index) => {
                        const from = '0x' + log.topics[1].slice(26);
                        const to = '0x' + log.topics[2].slice(26);
                        const value = formatUnits(log.data, 6);
                        console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
                    });
                }
            },
            onError: (error) => {
                console.error("转出事件监听错误:", error);
            }
        });

        // 查询最近的转入转出事件作为示例
        console.log("\n4. 查询最近10个区块的币安热钱包转入转出事件作为示例");
        
        const recentBlock = await publicClient.getBlockNumber();
        
        // 查询最近的转入事件
        const recentInEvents = await publicClient.getLogs({
            address: contractAddressUSDT,
            event: transferEvent,
            args: {
                to: accountBinance
            },
            fromBlock: recentBlock - 10n,
            toBlock: recentBlock
        });
        
        console.log(`最近10个区块中找到 ${recentInEvents.length} 个转入币安热钱包的事件`);
        if (recentInEvents.length > 0) {
            console.log("最近的转入事件示例:");
            recentInEvents.slice(0, 3).forEach((log, index) => {
                const from = '0x' + log.topics[1].slice(26);
                const to = '0x' + log.topics[2].slice(26);
                const value = formatUnits(log.data, 6);
                console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
            });
        }
        
        // 查询最近的转出事件
        const recentOutEvents = await publicClient.getLogs({
            address: contractAddressUSDT,
            event: transferEvent,
            args: {
                from: accountBinance
            },
            fromBlock: recentBlock - 10n,
            toBlock: recentBlock
        });
        
        console.log(`最近10个区块中找到 ${recentOutEvents.length} 个转出币安热钱包的事件`);
        if (recentOutEvents.length > 0) {
            console.log("最近的转出事件示例:");
            recentOutEvents.slice(0, 3).forEach((log, index) => {
                const from = '0x' + log.topics[1].slice(26);
                const to = '0x' + log.topics[2].slice(26);
                const value = formatUnits(log.data, 6);
                console.log(`${index + 1}. ${from} -> ${to} ${value} USDT`);
            });
        }
        
        console.log("\nWebSocket 监听器已启动，按 Ctrl+C 停止...");
        
        // 设置超时停止监听
        setTimeout(() => {
            console.log("停止 WebSocket 监听...");
            unwatchIn();
            unwatchOut();
            process.exit(0);
        }, 60000); // 60秒后停止

    } catch (e) {
        console.error("❌ 连接错误:", e.message);
        console.log("可能的原因:");
        console.log("1. WebSocket URL 格式不正确");
        console.log("2. Infura API Key 无效或已过期");
        console.log("3. 网络连接问题");
        console.log("4. Infura 服务暂时不可用");
        console.log("");
        console.log("建议:");
        console.log("- 检查 .env 文件中的 MAINNET_WSSURL 格式");
        console.log("- 确认 Infura API Key 有效");
        console.log("- 尝试使用 HTTP RPC 版本: node 9_events_filter_viem.js");
    }
};

main(); 