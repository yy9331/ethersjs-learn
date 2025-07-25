import { createPublicClient, http, formatEther, parseAbiItem } from "viem";
import { sepolia } from "viem/chains";
import { wethSepolia } from "./0_init_ethersjs.js";

const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
});

// 方法1: 从 ABI 字符串解析事件定义
const transferEventAbi = "event Transfer(address indexed from, address indexed to, uint256 amount)";
const transferEvent = parseAbiItem(transferEventAbi);

// 查询事件的函数
const queryEvents = async (fromBlock, toBlock) => {
    try {
        // 方法1: 使用解析的 ABI 事件
        const events = await publicClient.getLogs({
            address: wethSepolia,
            event: transferEvent,
            fromBlock: BigInt(fromBlock),
            toBlock: BigInt(toBlock)
        });
        
        // 方法2: 直接定义事件
        // const events = await publicClient.getLogs({
        //     address: wethSepolia,
        //     event: {
        //         type: 'event',
        //         name: 'Transfer',
        //         inputs: [
        //             { type: 'address', name: 'from', indexed: true },
        //             { type: 'address', name: 'to', indexed: true },
        //             { type: 'uint256', name: 'amount', indexed: false }
        //         ]
        //     },
        //     fromBlock: BigInt(fromBlock),
        //     toBlock: BigInt(toBlock)
        // });
        
        return events;
    } catch (error) {
        console.error("查询事件时发生错误:", error.message);
        return null;
    }
};

// 打印事件详情的函数
const printEventDetails = (events, blockRange) => {
    console.log(`在${blockRange}中找到 ${events.length} 个Transfer事件`);
    
    if (events.length > 0) {
        console.log("打印事件详情:");
        console.log(events[0]);
        
        console.log("\n2. 解析事件：");
        // 解析事件数据
        const from = '0x' + events[0].topics[1].slice(26); // 移除前导零
        const to = '0x' + events[0].topics[2].slice(26); // 移除前导零
        const amount = formatEther(events[0].data);
        console.log(`地址 ${from} 转账${amount} WETH 到地址 ${to}`);
        return true;
    }
    return false;
};

const main = async () => {
    console.log("\n1. 获取过去100个区块内的Transfer事件，并打印出1个");
    console.log("使用 parseAbiItem 解析的 Transfer 事件定义:");
    console.log(transferEvent);
    
    const block = await publicClient.getBlockNumber();
    console.log(`当前区块高度: ${block}`);
    
    // 查询最近10个区块的事件
    let events = await queryEvents(block - 10n, block);
    
    if (events && events.length > 0) {
        printEventDetails(events, "最近10个区块");
        return;
    }
    
    console.log("在最近10个区块内没有找到Transfer事件");
    console.log("尝试查询更早的区块...");
    
    // 查询更早的区块
    events = await queryEvents(block - 100n, block);
    if (events && events.length > 0) {
        printEventDetails(events, "更早的区块");
        return;
    }
    
    console.log("在最近100个区块内都没有找到Transfer事件");
    console.log("可能的原因：");
    console.log("1. WETH合约地址可能不正确");
    console.log("2. 该合约在Sepolia测试网上可能不活跃");
    console.log("3. 需要查询更早的区块或使用不同的合约地址");
};

main(); 
// [dotenv@17.0.1] injecting env (8) from .env – [tip] encrypt with dotenvx: https://dotenvx.com

// 1. 获取过去100个区块内的Transfer事件，并打印出1个
// 当前区块高度: 8836301
// 在最近10个区块中找到 4 个Transfer事件
// 打印事件详情:
// {
//   eventName: 'Transfer',
//   args: {
//     from: '0x2B06458Fd7039817B4d141a8C9A8A2265538Ca8A',
//     to: '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3',
//     amount: 39999999999999999n
//   },
//   address: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
//   topics: [
//     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//     '0x0000000000000000000000002b06458fd7039817b4d141a8c9a8a2265538ca8a',
//     '0x000000000000000000000000ee567fe1712faf6149d80da1e6934e354124cfe3'
//   ],
//   data: '0x000000000000000000000000000000000000000000000000008e1bc9bf03ffff',
//   blockNumber: 8836292n,
//   transactionHash: '0x911c6d31a93ba5d5abdcdc0f1e63ae9166a84cbb4806ab35dcfa0ac5181c6462',
//   transactionIndex: 175,
//   blockHash: '0x13799ab25e9834f0a1494c5ae8aed6415d1bb53601f7814e95d8ef50cf26c489',
//   logIndex: 359,
//   removed: false
// }

// 2. 解析事件：
// 地址 0x2b06458fd7039817b4d141a8c9a8a2265538ca8a 转账0x0000000000000000000000000000000000000000000000.00008e1bc9bf03ffff WETH 到地址 0xee567fe1712faf6149d80da1e6934e354124cfe3